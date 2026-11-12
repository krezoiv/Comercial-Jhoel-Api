# Frontend `layout`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [footer.component.ts](#f-comercial-jhoel-app-src-app-layout-footer-footer-component-ts) | .ts | Componente Angular | Layout | Componente Angular: declara `FooterComponent` (sin comentario de documentación en el código). | 6 internas; ext.: @angular/core, @angular/router, rxjs | 2 | Baja (2 consumidores) |
| [notifications-modal.component.ts](#f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts) | .ts | Componente Angular | Layout | Modal de "🔔 Notificaciones", abierto desde el Navbar (desktop y menú móvil) — reemplaza a la antigua sección grande "Mantente informado" que vivía en medio del scroll de la landing (`PushNotificationBannerComponent`, eliminada). | 5 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [navbar.component.ts](#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts) | .ts | Componente Angular | Layout | Componente Angular: declara `NavbarComponent`, `SECTION_TO_LINK` (sin comentario de documentación en el código). | 5 internas; ext.: @angular/core, @angular/router, rxjs | 2 | Baja (2 consumidores) |
| [footer.component.html](../../../../comercial-jhoel-app/src/app/layout/footer/footer.component.html) | .html | Plantilla HTML | Layout | Plantilla de `footer.component.ts`; usa 2 componentes hijos: `app-container`, `app-icon`. | — | — | Media |
| [footer.component.scss](../../../../comercial-jhoel-app/src/app/layout/footer/footer.component.scss) | .scss | Estilos SCSS | Layout | Estilos del componente del mismo nombre. | — | — | Baja |
| [notifications-modal.component.html](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.html) | .html | Plantilla HTML | Layout | Plantilla de `notifications-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [notifications-modal.component.scss](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.scss) | .scss | Estilos SCSS | Layout | Estilos del componente del mismo nombre. | — | — | Baja |
| [navbar.component.html](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.html) | .html | Plantilla HTML | Layout | Plantilla de `navbar.component.ts`; usa 4 componentes hijos: `app-container`, `app-icon`, `app-button`, `app-notifications-modal`. | — | — | Media |
| [navbar.component.scss](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.scss) | .scss | Estilos SCSS | Layout | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-layout-footer-footer-component-ts"></a>

### footer.component.ts

- **Ruta:** [footer.component.ts](../../../../comercial-jhoel-app/src/app/layout/footer/footer.component.ts) (`comercial-jhoel-app/src/app/layout/footer/footer.component.ts`, 64 líneas)
- **Tipo:** Componente Angular · **Capa:** Layout · **Módulo:** Frontend `layout`
- **Responsabilidad:** Componente Angular: declara `FooterComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [contact.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-contact-service-ts), [site-visits.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-site-visits-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [app.component.ts](root.md#f-comercial-jhoel-app-src-app-app-component-ts), [app.component.ts (plantilla)](root.md#f-comercial-jhoel-app-src-app-app-component-ts) (plantilla)
- **Plantilla:** [footer.component.html](../../../../comercial-jhoel-app/src/app/layout/footer/footer.component.html) · **Usa componentes:** [container.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-container-container-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)

#### Clase `FooterComponent` (L12–63)

- **Decoradores:** `@Component({ selector: 'app-footer', standalone: true, imports: [RouterLink, ContainerComponent, IconComponent], templateUrl: './footer.component.html', styleUrl`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `contactService = inject(ContactService)`, `siteVisitsService = inject(SiteVisitsService)`
- **Datos / estado que administra:** `channels = signal<ContactChannel[]>([])`, `socialLinks = signal<SocialLink[]>([])`, `businessHours = signal<string \| null>(null)`, `visitCount = signal<number \| null>(null)`
<a id="f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts"></a>

### notifications-modal.component.ts

- **Ruta:** [notifications-modal.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.ts) (`comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.ts`, 103 líneas)
- **Tipo:** Componente Angular · **Capa:** Layout · **Módulo:** Frontend `layout`
- **Responsabilidad:** Modal de "🔔 Notificaciones", abierto desde el Navbar (desktop y menú móvil) — reemplaza a la antigua sección grande "Mantente informado" que vivía en medio del scroll de la landing (`PushNotificationBannerComponent`, eliminada).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [install-prompt.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-install-prompt-service-ts), [public-news-subscription.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-news-subscription-service-ts), [push-notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-push-notification-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [navbar.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts), [navbar.component.ts (plantilla)](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts) (plantilla)
- **Plantilla:** [notifications-modal.component.html](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`, `(click)="deactivate()"`, `(change)="toggleType(type.id)"`, `(click)="activate()"`, `(click)="installApp()"`

#### Clase `NotificationsModalComponent` (L18–102)

- **Decoradores:** `@Component({ selector: 'app-notifications-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './notifications-modal.component.html`
- **Propósito:** Modal de "🔔 Notificaciones", abierto desde el Navbar (desktop y menú móvil) — reemplaza a la antigua sección grande "Mantente informado" que vivía en medio del scroll de la landing (`PushNotificationBannerComponent`, eliminada). Ninguna lógica de Push/PWA nueva: es exactamente el mismo contenido/estado que tenía esa sección, solo reubicado dentro de un modal — reutiliza `PushNotificationService`/`InstallPromptService` tal cual, sin duplicar nada del sistema Web Push ya implementado.
- **Servicios inyectados con `inject()`:** `publicNewsSubscriptionService = inject(PublicNewsSubscriptionService)`, `pushService = inject(PushNotificationService)`, `installPromptService = inject(InstallPromptService)`
- **Datos / estado que administra:** `@Input open = false`, `@Output closed = new EventEmitter<void>()`, `types = signal<PublicNewsType[]>([])`, `loadingTypes = signal(true)`, `selectedTypeIds = signal<Set<string>>(new Set())`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isChecked` | método public | 53–55 | `typeId: string` | `boolean` |
| `toggleType` | método public | 57–67 | `typeId: string` | `void` |
| `typeLabel` | método public | 69–71 | `type: PublicNewsType` | `string` |
| `canActivate` | getter public | 73–75 | — | `boolean` |
| `activate` | método public async | 77–86 | — | `Promise<void>` |
| `deactivate` | método public async | 88–93 | — | `Promise<void>` |
| `installApp` | método public async | 95–97 | — | `Promise<void>` |
| `close` | método public | 99–101 | — | `void` |

##### `NotificationsModalComponent.isChecked`

- **Firma:** `isChecked(typeId: string): boolean` — [notifications-modal.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedTypeIds().has`, `this.selectedTypeIds`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `notifications-modal.component.html` (plantilla)

##### `NotificationsModalComponent.toggleType`

- **Firma:** `toggleType(typeId: string): void` — [notifications-modal.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.ts#L57) (L57–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedTypeIds.update`, `new Set`, `next.has`, `next.delete`, `next.add`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedTypeIds.update`
- **Consumidores:** `notifications-modal.component.html` (plantilla)

##### `NotificationsModalComponent.typeLabel`

- **Firma:** `typeLabel(type: PublicNewsType): string` — [notifications-modal.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `notifications-modal.component.html` (plantilla)

##### `NotificationsModalComponent.canActivate`

- **Firma:** `canActivate(): boolean` — [notifications-modal.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.ts#L73) (L73–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedTypeIds`, `this.pushService.isBusy`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NotificationsModalComponent.activate`

- **Firma:** `activate(): Promise<void>` — [notifications-modal.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.ts#L77) (L77–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.pushService.subscribe`, `this.selectedTypeIds`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `notifications-modal.component.html` (plantilla)

##### `NotificationsModalComponent.deactivate`

- **Firma:** `deactivate(): Promise<void>` — [notifications-modal.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.ts#L88) (L88–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.pushService.isBusy`, `this.pushService.unsubscribe`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `notifications-modal.component.html` (plantilla)

##### `NotificationsModalComponent.installApp`

- **Firma:** `installApp(): Promise<void>` — [notifications-modal.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.installPromptService.promptInstall`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `notifications-modal.component.html` (plantilla)

##### `NotificationsModalComponent.close`

- **Firma:** `close(): void` — [notifications-modal.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/components/notifications-modal/notifications-modal.component.ts#L99) (L99–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** [navbar.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts), [navbar.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts), `notifications-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts"></a>

### navbar.component.ts

- **Ruta:** [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts) (`comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts`, 260 líneas)
- **Tipo:** Componente Angular · **Capa:** Layout · **Módulo:** Frontend `layout`
- **Responsabilidad:** Componente Angular: declara `NavbarComponent`, `SECTION_TO_LINK` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [notifications-modal.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts), [notifications-modal.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notifications-modal-service-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [app.component.ts](root.md#f-comercial-jhoel-app-src-app-app-component-ts), [app.component.ts (plantilla)](root.md#f-comercial-jhoel-app-src-app-app-component-ts) (plantilla)
- **Plantilla:** [navbar.component.html](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.html) · **Usa componentes:** [container.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-container-container-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [notifications-modal.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="closeMenu()"`, `(click)="openNotificationsModal()"`, `(click)="toggleDropdown(link.label)"`, `(click)="closeDropdown()"`, `(click)="toggleMenu()"`, `(click)="toggleMobileGroup(link.label)"`, `(closed)="closeNotificationsModal()"`

#### Clase `NavbarComponent` (L47–259)

- **Decoradores:** `@Component({ selector: 'app-navbar', standalone: true, imports: [ RouterLink, ContainerComponent, ButtonComponent, IconComponent, NotificationsModalComponent, ],`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `authService = inject(AuthService)`, `router = inject(Router)`, `zone = inject(NgZone)`, `destroyRef = inject(DestroyRef)`, `notificationsModal = inject(NotificationsModalService)`
- **Datos / estado que administra:** `isScrolled = signal(false)`, `isMenuOpen = signal(false)`, `openDropdownLabel = signal<string \| null>(null)`, `openMobileGroupLabel = signal<string \| null>(null)`, `accountLink = computed(() => this.authService.isAuthenticated() `, `isLanding = signal(this.isLandingUrl(this.router.url))`, `isOverlay = computed( () => this.isLanding() && !this.isScroll`, `activeLink = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `requestScrollUpdate` | propiedad-función private | 146–157 | — | `void` |
| `updateFromScroll` | método private | 159–177 | — | `void` |
| `computeActiveLink` | método private | 180–190 | — | `string \| null` |
| `isLandingUrl` | método private | 192–194 | `url: string` | `boolean` |
| `onEscape` | método public | 196–199 | — | `void` |
| `onDocumentClick` | método public | 206–215 | `event: MouseEvent` | `void` |
| `toggleMenu` | método public | 217–219 | — | `void` |
| `closeMenu` | método public | 221–225 | — | `void` |
| `isDropdownOpen` | método public | 227–229 | `label: string` | `boolean` |
| `toggleDropdown` | método public | 231–235 | `label: string` | `void` |
| `closeDropdown` | método public | 237–239 | — | `void` |
| `isMobileGroupOpen` | método public | 241–243 | `label: string` | `boolean` |
| `toggleMobileGroup` | método public | 245–249 | `label: string` | `void` |
| `openNotificationsModal` | método public | 251–254 | — | `void` |
| `closeNotificationsModal` | método public | 256–258 | — | `void` |

##### `NavbarComponent.requestScrollUpdate`

- **Firma:** `requestScrollUpdate(): void` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L146) (L146–157)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `requestAnimationFrame`, `this.updateFromScroll`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NavbarComponent.updateFromScroll`

- **Firma:** `updateFromScroll(): void` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L159) (L159–177)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Math.max`, `this.progressBar`, `Math.min(1, scrollY / maxScroll).toFixed`, `Math.min`, `this.isLanding`, `this.computeActiveLink`, `this.isScrolled`, `this.activeLink`, `this.zone.run`, `this.isScrolled.set`, `this.activeLink.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isScrolled.set`, `this.activeLink.set`
- **Consumidores:** (mismo archivo)

##### `NavbarComponent.computeActiveLink`

- **Firma:** `computeActiveLink(): string \| null` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L180) (L180–190)
- **Propósito / descripción:** La última sección cuyo borde superior ya cruzó una línea a ~30% del viewport bajo el navbar.
- **Dependencias (llamadas en su cuerpo):** `document.getElementById`, `element.getBoundingClientRect`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `NavbarComponent.isLandingUrl`

- **Firma:** `isLandingUrl(url: string): boolean` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L192) (L192–194)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `url.split`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NavbarComponent.onEscape`

- **Firma:** `onEscape(): void` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L196) (L196–199)
- **Decoradores:** `@HostListener('document:keydown.escape')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closeDropdown`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NavbarComponent.onDocumentClick`

- **Firma:** `onDocumentClick(event: MouseEvent): void` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L206) (L206–215)
- **Decoradores:** `@HostListener('document:click', ['$event'])`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.openDropdownLabel`, `target.closest`, `this.closeDropdown`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NavbarComponent.toggleMenu`

- **Firma:** `toggleMenu(): void` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L217) (L217–219)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isMenuOpen.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.isMenuOpen.update`
- **Consumidores:** `navbar.component.html` (plantilla)

##### `NavbarComponent.closeMenu`

- **Firma:** `closeMenu(): void` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L221) (L221–225)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isMenuOpen.set`, `this.openMobileGroupLabel.set`, `this.closeDropdown`
- **Efectos secundarios:** Actualiza estado (signals): `this.isMenuOpen.set`, `this.openMobileGroupLabel.set`
- **Consumidores:** `navbar.component.html` (plantilla), (mismo archivo)

##### `NavbarComponent.isDropdownOpen`

- **Firma:** `isDropdownOpen(label: string): boolean` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L227) (L227–229)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.openDropdownLabel`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `navbar.component.html` (plantilla)

##### `NavbarComponent.toggleDropdown`

- **Firma:** `toggleDropdown(label: string): void` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L231) (L231–235)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.openDropdownLabel.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.openDropdownLabel.update`
- **Consumidores:** `navbar.component.html` (plantilla)

##### `NavbarComponent.closeDropdown`

- **Firma:** `closeDropdown(): void` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L237) (L237–239)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.openDropdownLabel.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.openDropdownLabel.set`
- **Consumidores:** `navbar.component.html` (plantilla), (mismo archivo)

##### `NavbarComponent.isMobileGroupOpen`

- **Firma:** `isMobileGroupOpen(label: string): boolean` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L241) (L241–243)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.openMobileGroupLabel`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `navbar.component.html` (plantilla)

##### `NavbarComponent.toggleMobileGroup`

- **Firma:** `toggleMobileGroup(label: string): void` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L245) (L245–249)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.openMobileGroupLabel.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.openMobileGroupLabel.update`
- **Consumidores:** `navbar.component.html` (plantilla)

##### `NavbarComponent.openNotificationsModal`

- **Firma:** `openNotificationsModal(): void` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L251) (L251–254)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closeMenu`, `this.notificationsModal.open`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `navbar.component.html` (plantilla)

##### `NavbarComponent.closeNotificationsModal`

- **Firma:** `closeNotificationsModal(): void` — [navbar.component.ts](../../../../comercial-jhoel-app/src/app/layout/navbar/navbar.component.ts#L256) (L256–258)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.notificationsModal.close`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `navbar.component.html` (plantilla)

