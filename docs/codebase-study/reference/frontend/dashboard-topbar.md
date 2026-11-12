# Frontend `dashboard-topbar`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [alert-bell.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-topbar-components-alert-bell-alert-bell-component-ts) | .ts | Componente Angular | Feature (pantalla) | Self-contained, like `RegisterPurchaseFormComponent`/`RechargeSalesSummaryCardComponent` — calls `AlertsService` directly rather than routing state through a parent. | 6 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 2 | Baja (2 consumidores) |
| [dashboard-topbar.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-topbar-dashboard-topbar-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `DashboardTopbarComponent`, `deepestRouteTitle` (sin comentario de documentación en el código). | 4 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 2 | Baja (2 consumidores) |
| [alert-bell.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `alert-bell.component.ts`; usa 2 componentes hijos: `app-icon`, `app-badge`. | — | — | Media |
| [alert-bell.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [dashboard-topbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `dashboard-topbar.component.ts`; usa 2 componentes hijos: `app-icon`, `app-alert-bell`. | — | — | Media |
| [dashboard-topbar.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-topbar-components-alert-bell-alert-bell-component-ts"></a>

### alert-bell.component.ts

- **Ruta:** [alert-bell.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.ts`, 165 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-topbar`
- **Responsabilidad:** Self-contained, like `RegisterPurchaseFormComponent`/`RechargeSalesSummaryCardComponent` — calls `AlertsService` directly rather than routing state through a parent.
- **Depende de (archivos del proyecto):** [alerts.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-alerts-service-ts), [purchases.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchases-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [dashboard-topbar.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-dashboard-topbar-component-ts), [dashboard-topbar.component.ts (plantilla)](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-dashboard-topbar-component-ts) (plantilla)
- **Plantilla:** [alert-bell.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="togglePanel()"`, `(click)="closePanel()"`, `(click)="markAllAsRead()"`, `(click)="selectAlert(alert)"`, `(click)="markPurchaseAsPaid($event, alert)"`, `(keydown.enter)="markPurchaseAsPaid($event, alert)"`

#### Clase `AlertBellComponent` (L29–164)

- **Decoradores:** `@Component({ selector: 'app-alert-bell', standalone: true, imports: [IconComponent, BadgeComponent], templateUrl: './alert-bell.component.html', styleUrl: './ale`
- **Propósito:** Self-contained, like `RegisterPurchaseFormComponent`/`RechargeSalesSummaryCardComponent` — calls `AlertsService` directly rather than routing state through a parent. Polls on a fixed interval, refetches whenever the panel opens (so a badge count that's gone stale between polls is corrected the moment the user actually looks), and refetches on every navigation (an alert's underlying condition can change as a side effect of whatever screen the user just left — paying a purchase, closing a recharge day, registering a transfer). Deliberately polling, not a WebSocket — this app has no real-time transport anywhere else (`SalesDraftStore`/`PurchaseDraftStore` are local/sessionStorage-only), and alerts are read-heavy, low-frequency-change data where a 60s staleness window is an acceptable, much simpler trade-off.
- **Servicios inyectados con `inject()`:** `alertsService = inject(AlertsService)`, `purchasesService = inject(PurchasesService)`, `notificationService = inject(NotificationService)`, `router = inject(Router)`
- **Datos / estado que administra:** `isOpen = signal(false)`, `isLoading = signal(false)`, `items = signal<Alert[]>([])`, `unreadCount = signal(0)`, `payingKeys = signal<Set<string>>(new Set())`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchAlerts` | método private | 63–78 | — | `void` |
| `togglePanel` | método public | 80–86 | — | `void` |
| `closePanel` | método public | 88–90 | — | `void` |
| `selectAlert` | método public | 92–102 | `alert: Alert` | `void` |
| `isPayable` | método public | 105–107 | `alert: Alert` | `boolean` |
| `isPaying` | método public | 109–111 | `alert: Alert` | `boolean` |
| `markPurchaseAsPaid` | método public | 120–145 | `event: Event`, `alert: Alert` | `void` |
| `removeAlert` | método private | 147–153 | `key: string` | `void` |
| `markAllAsRead` | método public | 155–163 | — | `void` |

##### `AlertBellComponent.fetchAlerts`

- **Firma:** `fetchAlerts(): void` — [alert-bell.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.ts#L63) (L63–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isLoading.set`, `this.alertsService.getAlerts().subscribe`, `this.alertsService.getAlerts`, `this.items.set`, `this.unreadCount.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isLoading.set`, `this.items.set`, `this.unreadCount.set`
- **Consumidores:** (mismo archivo)

##### `AlertBellComponent.togglePanel`

- **Firma:** `togglePanel(): void` — [alert-bell.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.ts#L80) (L80–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isOpen`, `this.isOpen.set`, `this.fetchAlerts`
- **Efectos secundarios:** Actualiza estado (signals): `this.isOpen.set`
- **Consumidores:** `alert-bell.component.html` (plantilla)

##### `AlertBellComponent.closePanel`

- **Firma:** `closePanel(): void` — [alert-bell.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.ts#L88) (L88–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isOpen.set`
- **Consumidores:** `alert-bell.component.html` (plantilla), (mismo archivo)

##### `AlertBellComponent.selectAlert`

- **Firma:** `selectAlert(alert: Alert): void` — [alert-bell.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.ts#L92) (L92–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.alertsService.markAsRead(alert.key).subscribe`, `this.alertsService.markAsRead`, `this.items.update`, `items.map`, `this.unreadCount.update`, `Math.max`, `this.closePanel`, `this.router.navigateByUrl`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`, `this.unreadCount.update`
- **Consumidores:** `alert-bell.component.html` (plantilla)

##### `AlertBellComponent.isPayable`

- **Firma:** `isPayable(alert: Alert): boolean` — [alert-bell.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.ts#L105) (L105–107)
- **Propósito / descripción:** Only `PURCHASE_PAYMENT_DUE`/`PURCHASE_PAYMENT_OVERDUE` alerts carry a purchase id worth acting on directly from the panel.
- **Dependencias (llamadas en su cuerpo):** `PAYABLE_ALERT_TYPES.includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `alert-bell.component.html` (plantilla)

##### `AlertBellComponent.isPaying`

- **Firma:** `isPaying(alert: Alert): boolean` — [alert-bell.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.ts#L109) (L109–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.payingKeys().has`, `this.payingKeys`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `alert-bell.component.html` (plantilla), (mismo archivo)

##### `AlertBellComponent.markPurchaseAsPaid`

- **Firma:** `markPurchaseAsPaid(event: Event, alert: Alert): void` — [alert-bell.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.ts#L120) (L120–145)
- **Propósito / descripción:** "Marcar como pagada" straight from the panel — this is the deliberate, minimal UI home for the payment action (see the API's CLAUDE.md, `MarkPurchaseAsPaidUseCase`'s own doc comment): no purchase-history list page exists yet to put it on instead, and the alert already carries everything needed (`referenceId` is the purchase id).
- **Dependencias (llamadas en su cuerpo):** `event.stopPropagation`, `this.isPaying`, `this.payingKeys.update`, `new Set(keys).add`, `new Set`, `this.purchasesService.markAsPaid(alert.referenceId).subscribe`, `this.purchasesService.markAsPaid`, `this.notificationService.success`, `next.delete`, `this.removeAlert`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.payingKeys.update`
- **Consumidores:** `alert-bell.component.html` (plantilla)

##### `AlertBellComponent.removeAlert`

- **Firma:** `removeAlert(key: string): void` — [alert-bell.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.ts#L147) (L147–153)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items().find`, `this.items`, `this.items.update`, `items.filter`, `this.unreadCount.update`, `Math.max`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`, `this.unreadCount.update`
- **Consumidores:** (mismo archivo)

##### `AlertBellComponent.markAllAsRead`

- **Firma:** `markAllAsRead(): void` — [alert-bell.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/components/alert-bell/alert-bell.component.ts#L155) (L155–163)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.unreadCount`, `this.alertsService.markAllAsRead().subscribe`, `this.alertsService.markAllAsRead`, `this.items.update`, `items.map`, `this.unreadCount.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`, `this.unreadCount.set`
- **Consumidores:** `alert-bell.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-topbar-dashboard-topbar-component-ts"></a>

### dashboard-topbar.component.ts

- **Ruta:** [dashboard-topbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.ts`, 109 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-topbar`
- **Responsabilidad:** Componente Angular: declara `DashboardTopbarComponent`, `deepestRouteTitle` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [theme.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-theme-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [alert-bell.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-components-alert-bell-alert-bell-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [dashboard-layout.component.ts](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts), [dashboard-layout.component.ts (plantilla)](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts) (plantilla)
- **Plantilla:** [dashboard-topbar.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [alert-bell.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-components-alert-bell-alert-bell-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="menuToggled.emit()"`, `(click)="toggleTheme()"`, `(click)="toggleUserMenu()"`, `(click)="closeUserMenu()"`, `(click)="requestChangePassword()"`, `(click)="requestLogout()"`

#### Clase `DashboardTopbarComponent` (L30–108)

- **Decoradores:** `@Component({ selector: 'app-dashboard-topbar', standalone: true, imports: [DatePipe, RouterLink, IconComponent, AlertBellComponent], templateUrl: './dashboard-to`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `authService = inject(AuthService)`, `themeService = inject(ThemeService)`, `router = inject(Router)`
- **Datos / estado que administra:** `@Output menuToggled = new EventEmitter<void>()`, `@Output changePasswordRequested = new EventEmitter<void>()`, `@Output logoutRequested = new EventEmitter<void>()`, `now = signal(new Date())`, `isUserMenuOpen = signal(false)`, `isScrolled = signal(false)`, `isDarkTheme = computed(() => this.themeService.theme() === 'DARK`, `currentPageLabel = computed(() => { const title = this.routeTitle(); `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onWindowScroll` | método public | 77–80 | — | `void` |
| `toggleTheme` | método public | 82–84 | — | `void` |
| `toggleUserMenu` | método public | 91–93 | — | `void` |
| `closeUserMenu` | método public | 95–97 | — | `void` |
| `requestChangePassword` | método public | 99–102 | — | `void` |
| `requestLogout` | método public | 104–107 | — | `void` |

##### `DashboardTopbarComponent.onWindowScroll`

- **Firma:** `onWindowScroll(): void` — [dashboard-topbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.ts#L77) (L77–80)
- **Decoradores:** `@HostListener('window:scroll')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isScrolled.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isScrolled.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DashboardTopbarComponent.toggleTheme`

- **Firma:** `toggleTheme(): void` — [dashboard-topbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.themeService.setTheme`, `this.isDarkTheme`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `dashboard-topbar.component.html` (plantilla)

##### `DashboardTopbarComponent.toggleUserMenu`

- **Firma:** `toggleUserMenu(): void` — [dashboard-topbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isUserMenuOpen.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.isUserMenuOpen.update`
- **Consumidores:** `dashboard-topbar.component.html` (plantilla)

##### `DashboardTopbarComponent.closeUserMenu`

- **Firma:** `closeUserMenu(): void` — [dashboard-topbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isUserMenuOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isUserMenuOpen.set`
- **Consumidores:** `dashboard-topbar.component.html` (plantilla), (mismo archivo)

##### `DashboardTopbarComponent.requestChangePassword`

- **Firma:** `requestChangePassword(): void` — [dashboard-topbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.ts#L99) (L99–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closeUserMenu`, `this.changePasswordRequested.emit`
- **Efectos secundarios:** Emite eventos: `this.changePasswordRequested.emit`
- **Consumidores:** `dashboard-topbar.component.html` (plantilla)

##### `DashboardTopbarComponent.requestLogout`

- **Firma:** `requestLogout(): void` — [dashboard-topbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.ts#L104) (L104–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closeUserMenu`, `this.logoutRequested.emit`
- **Efectos secundarios:** Emite eventos: `this.logoutRequested.emit`
- **Consumidores:** `dashboard-topbar.component.html` (plantilla)

#### Función `deepestRouteTitle` (L22–28)

- **Tipo:** función local del archivo
- **Firma:** `deepestRouteTitle(snapshot: ActivatedRouteSnapshot): string \| undefined` — [dashboard-topbar.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/topbar/dashboard-topbar.component.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

