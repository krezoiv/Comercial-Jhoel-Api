# Frontend `core-services`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [account-receivable-payment.service.ts](#f-comercial-jhoel-app-src-app-core-services-account-receivable-payment-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Cuentas por Cobrar → "Cancelar cuenta(s)" API client. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 4 | Media (4 consumidores) |
| [account-receivable.service.ts](#f-comercial-jhoel-app-src-app-core-services-account-receivable-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Drops `undefined`/empty-string values — `HttpParams` would otherwise send the literal string `"undefined"` as a query value. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [account-type.service.ts](#f-comercial-jhoel-app-src-app-core-services-account-type-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `AccountTypeService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [alert-settings.service.ts](#f-comercial-jhoel-app-src-app-core-services-alert-settings-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `AlertSettingsService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [alerts.service.ts](#f-comercial-jhoel-app-src-app-core-services-alerts-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `AlertsService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [app-update.service.ts](#f-comercial-jhoel-app-src-app-core-services-app-update-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Detecta y aplica actualizaciones del Service Worker de Angular (`ngsw-worker.js` — el único que existe, ver `app.config.ts`) para que una PWA instalada deje de quedarse atrapada en una versión vieja hasta que el cliente la cierre y reabra manualmente. | 6 internas; ext.: @angular/core, @angular/service-worker, rxjs | 2 | Baja (2 consumidores) |
| [asset.service.ts](#f-comercial-jhoel-app-src-app-core-services-asset-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Drops `undefined`/empty-string values — `HttpParams` would otherwise send the literal string `"undefined"` as a query value. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [assets-receivables-report-state.service.ts](#f-comercial-jhoel-app-src-app-core-services-assets-receivables-report-state-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Holds the Reportería de Activos y Cuentas por Cobrar page's checkboxes, filters, and last-fetched results in a root-provided singleton — the same `providedIn: 'root'` + signals technique `PurchaseDraftStore`/ `SalesDraftStore` already established for surviving component destruction on route navigation (see those services' own doc comments). | 1 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [auth.service.ts](#f-comercial-jhoel-app-src-app-core-services-auth-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `AuthService`, `AuthUser`, `AuthResult`, `LoginResponse`, `UserRole` (sin comentario de documentación en el código). | 4 internas; ext.: @angular/common, @angular/core, rxjs | 52 | Alta (52 consumidores) |
| [bank-agent.service.ts](#f-comercial-jhoel-app-src-app-core-services-bank-agent-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Backs the public landing page's "Agente Bancario" marketing section (`features/landing/sections/bank-agents/`) — static service-offering copy (deposits, withdrawals, bill pay...), unrelated to the internal "Agentes Bancarios" → Cuadre Agentes admin module (`BankService`/ `BankBalanceService`/`CuadreAgentesService`) despite the similar name. | 2 internas; ext.: @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [bank-balance-draft.store.ts](#f-comercial-jhoel-app-src-app-core-services-bank-balance-draft-store-ts) | .ts | Store (estado) | Core (servicios, modelos, guards) | The in-progress "Agentes Bancarios → Bancos" cuadre — same root-provided, sessionStorage-backed singleton pattern as `PurchaseDraftStore`/ `IceCreamPurchaseDraftStore` (see those files' own doc comments for the full reasoning): nothing is sent to the backend until "Guardar Cambios", and navigating away and back must never lose what was typed. | 1 internas; ext.: @angular/core | 5 | Media (5 consumidores) |
| [bank-balance.service.ts](#f-comercial-jhoel-app-src-app-core-services-bank-balance-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `BankBalanceService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [bank-deposit-draft.store.spec.ts](#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-spec-ts) | .ts | Prueba unitaria | Core (servicios, modelos, guards) | Prueba unitaria: declara `USER_ID`, `STORAGE_KEY` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 0 | Soporte (pruebas) |
| [bank-deposit-draft.store.ts](#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts) | .ts | Store (estado) | Core (servicios, modelos, guards) | The in-progress "Transaccionar" deposit — a root-provided singleton so it survives route navigation, mirroring `PurchaseDraftStore`'s exact reasoning (see that store's own doc comment): Transaccionar has no server-side draft either — nothing is sent to the backend until "Confirmar y Guardar" — so th | 2 internas; ext.: @angular/core | 15 | Alta (15 consumidores) |
| [bank-deposit.service.ts](#f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `BankDepositService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 9 | Media (9 consumidores) |
| [bank-transfer.service.ts](#f-comercial-jhoel-app-src-app-core-services-bank-transfer-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Finanzas → Transferencias Bancarias. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [bank.service.ts](#f-comercial-jhoel-app-src-app-core-services-bank-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `BankService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 10 | Alta (10 consumidores) |
| [business.service.ts](#f-comercial-jhoel-app-src-app-core-services-business-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `BusinessService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 6 | Media (6 consumidores) |
| [cash-control-sync.service.ts](#f-comercial-jhoel-app-src-app-core-services-cash-control-sync-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | "El efectivo físico cambió" — the real-time update mechanism of Control de Efectivo. | 1 internas; ext.: @angular/core, rxjs | 4 | Media (4 consumidores) |
| [cash-control.service.ts](#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Finance → Control de Efectivo API client. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 17 | Alta (17 consumidores) |
| [cash-custody.service.ts](#f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | API client of "Arqueo de Caja" and "Bodega". | 2 internas; ext.: @angular/common, @angular/core, rxjs | 11 | Alta (11 consumidores) |
| [catalog-bank.service.ts](#f-comercial-jhoel-app-src-app-core-services-catalog-bank-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Admin "Sistema → Catálogo de Bancos" — CRUD + orden + imagen. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [catalog-phone.service.ts](#f-comercial-jhoel-app-src-app-core-services-catalog-phone-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Admin "Catálogo → Teléfonos" — gestión completa (CRUD + publicar/despublicar + orden + imágenes). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [catalog-product-request.service.ts](#f-comercial-jhoel-app-src-app-core-services-catalog-product-request-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Admin "Solicitudes de Variedades" — leads de "Lo quiero" capturados desde la landing pública. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [catalog-product.service.ts](#f-comercial-jhoel-app-src-app-core-services-catalog-product-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Admin "Catálogo → Librería"/"Variedades y Accesorios" — un solo servicio compartido, parametrizado por `section`. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [catalog-request.service.ts](#f-comercial-jhoel-app-src-app-core-services-catalog-request-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Admin "Catálogo → Solicitudes" — leads de interés/crédito capturados desde la landing pública. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [catalog.service.ts](#f-comercial-jhoel-app-src-app-core-services-catalog-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Product catalog categories shown on the landing preview and the full catalog page. | 2 internas; ext.: @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [category.service.ts](#f-comercial-jhoel-app-src-app-core-services-category-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `CategoryService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 5 | Media (5 consumidores) |
| [client.service.ts](#f-comercial-jhoel-app-src-app-core-services-client-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `ClientService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 6 | Media (6 consumidores) |
| [closed-days.service.ts](#f-comercial-jhoel-app-src-app-core-services-closed-days-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | "Sistema → Gestión de Días Cerrados" — every backend route (`ClosedDaysController`) already requires ADMIN/SUPER_ADMIN via a class-level `@Roles`; this service doesn't repeat that check, it's just the HTTP client. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 4 | Media (4 consumidores) |
| [company-settings.service.ts](#f-comercial-jhoel-app-src-app-core-services-company-settings-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `CompanySettingsService`, `BASE_URL`, `PUBLIC_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [confirm-dialog.service.ts](#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Global, reusable "are you sure?" mechanism — the `ConfirmDialogService`/ `ConfirmDialogComponent` pair mirrors `NotificationService`/ `ToastContainerComponent` exactly (root-provided signal-based service + one component mounted once in `AppComponent`). | 0 internas; ext.: @angular/core | 73 | Alta (73 consumidores) |
| [contact.service.ts](#f-comercial-jhoel-app-src-app-core-services-contact-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Digits only — `tel:`/`wa.me` links need a clean numeric string, whatever formatting the admin typed (spaces, dashes, +) is stripped. | 3 internas; ext.: @angular/core, rxjs | 8 | Media (8 consumidores) |
| [cuadre-agentes-state.service.spec.ts](#f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-state-service-spec-ts) | .ts | Prueba unitaria | Core (servicios, modelos, guards) | Prueba unitaria: declara `INFO` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 0 | Soporte (pruebas) |
| [cuadre-agentes-state.service.ts](#f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-state-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Holds the Cuadre Agentes page's cash-count quantities in a root-provided singleton — the same `providedIn: 'root'` + signals technique the draft stores use for surviving component destruction on route navigation. | 1 internas; ext.: @angular/core | 3 | Media (3 consumidores) |
| [cuadre-agentes.service.ts](#f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `CuadreAgentesService`, `BASE_URL`, `RECONCILIATIONS_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 4 | Media (4 consumidores) |
| [dashboard-metrics.service.ts](#f-comercial-jhoel-app-src-app-core-services-dashboard-metrics-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Admin-only on the backend (`@Roles`) — the caller (`DashboardHomeComponent`) is responsible for only invoking this when `AuthService.isAdmin()` is true; a `USER`-role token gets a real `403` from the backend regardless. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [dashboard-summary.service.ts](#f-comercial-jhoel-app-src-app-core-services-dashboard-summary-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Phase 2: replace the `of(...)` body with `this.http.get&lt;DashboardSummaryItem[]&gt;(\`${environment.apiUrl}/dashboard/summary\`)`. | 2 internas; ext.: @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [day-status.service.ts](#f-comercial-jhoel-app-src-app-core-services-day-status-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Shared "is today's day open?" state — a `providedIn: 'root'` singleton, same pattern as `PurchaseDraftStore`/`SalesDraftStore` (see those files), so the Sidebar (mounted once for all of `/dashboard/*`) and the Bancos page (destroyed and recreated on every navigation) read and write exactly the same signal. | 2 internas; ext.: @angular/core, rxjs | 6 | Media (6 consumidores) |
| [financial-day-review.service.ts](#f-comercial-jhoel-app-src-app-core-services-financial-day-review-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | API client of "Revisión de días operativos". | 2 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [fragment-scroll.service.ts](#f-comercial-jhoel-app-src-app-core-services-fragment-scroll-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Owns all scroll-on-navigation behavior, replacing the router's built-in `withInMemoryScrolling` (see app.config.ts for why): scrolls to top on a plain route change, or to the element matching the URL fragment (e.g. | 0 internas; ext.: @angular/core, @angular/router | 1 | Baja (1 consumidores) |
| [guayacan-cash-box.service.ts](#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Cuadre de Caja Guayacán. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 10 | Alta (10 consumidores) |
| [guayacan-cash-sync.service.spec.ts](#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-spec-ts) | .ts | Prueba unitaria | Core (servicios, modelos, guards) | Prueba unitaria (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core | 0 | Soporte (pruebas) |
| [guayacan-cash-sync.service.ts](#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Aviso "cambió el efectivo de Cooperativa Guayacán". | 0 internas; ext.: @angular/core, rxjs | 7 | Media (7 consumidores) |
| [ice-cream-purchase-draft.store.ts](#f-comercial-jhoel-app-src-app-core-services-ice-cream-purchase-draft-store-ts) | .ts | Store (estado) | Core (servicios, modelos, guards) | The in-progress "Compras de Heladería" invoice — same root-provided, sessionStorage-backed singleton pattern as `PurchaseDraftStore` (see that file's own doc comment for the full reasoning). | 2 internas; ext.: @angular/core | 3 | Media (3 consumidores) |
| [ice-cream-purchases.service.ts](#f-comercial-jhoel-app-src-app-core-services-ice-cream-purchases-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `IceCreamPurchasesService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [ice-cream-report-state.service.ts](#f-comercial-jhoel-app-src-app-core-services-ice-cream-report-state-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Holds the Reportería de Heladería page's checkboxes, filters, and last-fetched results in a root-provided singleton — same reasoning as `AssetsReceivablesReportStateService` (see its own doc comment). | 1 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [ice-cream-sale-draft.store.ts](#f-comercial-jhoel-app-src-app-core-services-ice-cream-sale-draft-store-ts) | .ts | Store (estado) | Core (servicios, modelos, guards) | The in-progress "Ventas de Heladería" receipt — same client-only draft pattern as `IceCreamPurchaseDraftStore`/`PurchaseDraftStore` rather than Ventas' server-persisted open-sale pattern: nothing is sent to the backend until "Guardar venta", which confirms the whole receipt atomically via `confirm_i | 2 internas; ext.: @angular/core | 3 | Media (3 consumidores) |
| [ice-cream-sales.service.ts](#f-comercial-jhoel-app-src-app-core-services-ice-cream-sales-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `IceCreamSalesService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [ice-cream.service.ts](#f-comercial-jhoel-app-src-app-core-services-ice-cream-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `IceCreamService`, `BASE_URL`, `LIST_LIMIT`, `SEARCH_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 5 | Media (5 consumidores) |
| [install-prompt.service.ts](#f-comercial-jhoel-app-src-app-core-services-install-prompt-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Instalación de la PWA en Android/Chrome/Edge — el equivalente de "Agregar a pantalla de inicio" de iOS, pero con una API real: estos navegadores disparan `beforeinstallprompt` apenas el sitio cumple los criterios de instalabilidad (HTTPS, manifest válido, Service Worker registrado — los tres ya exis | 0 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [inventory-locations.service.ts](#f-comercial-jhoel-app-src-app-core-services-inventory-locations-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Talks to `${environment.apiUrl}/inventory` — locations, per-product presentations, the aggregated product-inventory detail view, and transfers. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 6 | Media (6 consumidores) |
| [inventory.service.ts](#f-comercial-jhoel-app-src-app-core-services-inventory-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Raw shape the API returns for a product — `category` maps this to the flat `Product` the UI uses. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 10 | Alta (10 consumidores) |
| [keyboard-shortcut.service.ts](#f-comercial-jhoel-app-src-app-core-services-keyboard-shortcut-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Talks to `${environment.apiUrl}/keyboard-shortcuts` — CRUD for "Sistema → Atajos de Teclado". | 2 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [keyboard-shortcuts.service.ts](#f-comercial-jhoel-app-src-app-core-services-keyboard-shortcuts-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Global keyboard-shortcut → navigation mechanism, mirroring `FragmentScrollService`'s exact shape (root-provided singleton, one `listen()` method started once from `AppComponent`'s constructor, `takeUntilDestroyed(this.destroyRef)` for its own subscription) — not a new pattern invented for this feature. | 3 internas; ext.: @angular/core, @angular/router, rxjs | 2 | Baja (2 consumidores) |
| [landing-background.service.ts](#f-comercial-jhoel-app-src-app-core-services-landing-background-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Admin "Sistema → Fondos de Landing" — CRUD + imagen. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 4 | Media (4 consumidores) |
| [landing-quick-access.store.ts](#f-comercial-jhoel-app-src-app-core-services-landing-quick-access-store-ts) | .ts | Store (estado) | Core (servicios, modelos, guards) | Puente entre las secciones de catálogo y el dock de acceso rápido: cada sección publica aquí, al cargar sus datos, si tiene contenido y la URL de una imagen que ella misma ya muestra. | 0 internas; ext.: @angular/core | 5 | Media (5 consumidores) |
| [news-subscriber.service.ts](#f-comercial-jhoel-app-src-app-core-services-news-subscriber-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Admin "Sistema → Suscriptores de Noticias" — todo el controller es admin-only en el backend, incluidos los `GET` (expone WhatsApp/consentimiento de clientes). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [news-type.service.ts](#f-comercial-jhoel-app-src-app-core-services-news-type-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Admin "Sistema → Tipos de Noticias" — CRUD + orden. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [news.service.ts](#f-comercial-jhoel-app-src-app-core-services-news-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Admin "Sistema → Noticias" — CRUD + orden + imagen. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [notification.service.ts](#f-comercial-jhoel-app-src-app-core-services-notification-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Global toast feedback — one signal list, rendered once by ToastContainerComponent in AppComponent. | 1 internas; ext.: @angular/core | 112 | Alta (112 consumidores) |
| [notifications-modal.service.ts](#f-comercial-jhoel-app-src-app-core-services-notifications-modal-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Único estado "abierto/cerrado" del `NotificationsModalComponent` (el modal de Web Push que monta el Navbar una sola vez). | 0 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [offers.service.ts](#f-comercial-jhoel-app-src-app-core-services-offers-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Provides the list of services Comercial Jhoel offers (útiles escolares, fotocopias, agente bancario, etc). | 2 internas; ext.: @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [parallax.service.ts](#f-comercial-jhoel-app-src-app-core-services-parallax-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Single shared scroll-linked parallax engine for the whole app — ONE `window.scroll`/`resize` listener total, no matter how many decorative layers register with it (`ParallaxLayerDirective` is the consumer-facing side of this). | 0 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [pdf-prompt-modal.service.ts](#f-comercial-jhoel-app-src-app-core-services-pdf-prompt-modal-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | A dedicated, small modal for the post-save "¿Generar PDF?" prompt used by Ventas/Compras — deliberately NOT built on `ConfirmDialogService`, which only ever renders exactly two buttons (Cancelar/Confirmar) and has no loading/error state of its own (by design — see its own doc comment). | 0 internas; ext.: @angular/core, rxjs | 3 | Media (3 consumidores) |
| [phones.service.ts](#f-comercial-jhoel-app-src-app-core-services-phones-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Mirrors `RechargeSimsService`'s own shape — `registerSale`/`getSaleDpiImage` follow the identical `FormData`/blob conventions documented there. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 4 | Media (4 consumidores) |
| [presentation-type.service.ts](#f-comercial-jhoel-app-src-app-core-services-presentation-type-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `PresentationTypeService`, `toParams`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [public-catalog-bank.service.ts](#f-comercial-jhoel-app-src-app-core-services-public-catalog-bank-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Público, sin autenticación — backs "Bancos" en la landing. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [public-catalog.service.ts](#f-comercial-jhoel-app-src-app-core-services-public-catalog-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Público, sin autenticación — backs la sección "Teléfonos" de la landing y el modal de interés. | 3 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [public-landing-background.service.ts](#f-comercial-jhoel-app-src-app-core-services-public-landing-background-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Público, sin autenticación — backs la capa de fondos 3D de la landing. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [public-news-subscription.service.ts](#f-comercial-jhoel-app-src-app-core-services-public-news-subscription-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Público, sin autenticación — backs la sección "Recibe nuestras noticias por WhatsApp" de la landing, el banner de notificaciones push (`PushNotificationService`), y la página de autoservicio de preferencias (`/noticias/preferencias/:token`). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [public-news.service.ts](#f-comercial-jhoel-app-src-app-core-services-public-news-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Público, sin autenticación — backs "Noticias" en la landing. | 3 internas; ext.: @angular/common, @angular/core, rxjs | 4 | Media (4 consumidores) |
| [public-product-catalog.service.ts](#f-comercial-jhoel-app-src-app-core-services-public-product-catalog-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Público, sin autenticación — backs "Librería" y "Variedades y Accesorios" en la landing, y el modal "Lo quiero" de Variedades. | 3 internas; ext.: @angular/common, @angular/core, rxjs | 4 | Media (4 consumidores) |
| [purchase-draft.store.ts](#f-comercial-jhoel-app-src-app-core-services-purchase-draft-store-ts) | .ts | Store (estado) | Core (servicios, modelos, guards) | The in-progress "Compras" invoice(s), lifted out of `PurchasesPageComponent` into a root-provided singleton so it survives route navigation — Angular never destroys a `providedIn: 'root'` service just because its consuming component unmounts, only a full page reload does that. | 2 internas; ext.: @angular/core | 4 | Media (4 consumidores) |
| [purchases.service.ts](#f-comercial-jhoel-app-src-app-core-services-purchases-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `PurchasesService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 8 | Media (8 consumidores) |
| [push-notification.service.ts](#f-comercial-jhoel-app-src-app-core-services-push-notification-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Envuelve `SwPush` (el mismo Service Worker de PWA registrado en `app.config.ts` — nunca uno segundo) para el flujo público de notificaciones push de Noticias. | 2 internas; ext.: @angular/core, @angular/service-worker, rxjs | 1 | Baja (1 consumidores) |
| [quotations.service.ts](#f-comercial-jhoel-app-src-app-core-services-quotations-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | A Cotización is explicitly NOT a sale — this service only ever calls `/quotations`, never `/sales` or `/inventory`. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [recharge-cash-box.service.ts](#f-comercial-jhoel-app-src-app-core-services-recharge-cash-box-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | "Gestión Caja Recargas" — fully independent from `RechargesService` (moved out of it per an explicit follow-up: this used to be a section embedded inside the Recargas Electrónicas page; it's now its own Sistema-level module with its own route, sidebar entry, and backend module). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 4 | Media (4 consumidores) |
| [recharge-day-status.service.ts](#f-comercial-jhoel-app-src-app-core-services-recharge-day-status-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Shared "is today's Recargas day open?" state — a `providedIn: 'root'` singleton, same pattern as `DayStatusService` (Bancos/Cuadre Agentes), fully independent from it: separate backend table, separate lifecycle, never shares state with Bancos' own day-opening. | 2 internas; ext.: @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [recharge-days.service.ts](#f-comercial-jhoel-app-src-app-core-services-recharge-days-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | "Sistema → Gestión de Días de Recargas" — the Recargas-specific counterpart to `ClosedDaysService` (Bancos), fully independent from it. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [recharge-sims.service.ts](#f-comercial-jhoel-app-src-app-core-services-recharge-sims-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Mirrors `RechargesService`'s own shape — a fully separate service hitting `/recharges/sims/*`, never mixed with the electronic-balance endpoints. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 6 | Media (6 consumidores) |
| [recharges.service.ts](#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `RechargesService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 11 | Alta (11 consumidores) |
| [reports.service.ts](#f-comercial-jhoel-app-src-app-core-services-reports-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Drops `undefined`/empty-string values — `HttpParams` would otherwise send the literal string `"undefined"` as a query value. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 11 | Alta (11 consumidores) |
| [role.service.ts](#f-comercial-jhoel-app-src-app-core-services-role-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `RoleService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [sales-cash-box.service.ts](#f-comercial-jhoel-app-src-app-core-services-sales-cash-box-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | "Caja de Ventas" por negocio — saldo acumulado independiente + aportes/retiros. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [sales-draft.store.ts](#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts) | .ts | Store (estado) | Core (servicios, modelos, guards) | The in-progress "Ventas" receipt(s), lifted out of `SalesPageComponent` into a root-provided singleton — same reasoning `PurchaseDraftStore` documents for Compras (sidebar indicator without a round-trip, no refetch needed on revisiting the page). | 5 internas; ext.: @angular/common, @angular/core | 4 | Media (4 consumidores) |
| [sales-register.service.ts](#f-comercial-jhoel-app-src-app-core-services-sales-register-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Talks to `${environment.apiUrl}/sales-register` — "Gestión de Caja de Ventas", read-only. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [sales.service.ts](#f-comercial-jhoel-app-src-app-core-services-sales-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `SalesService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 6 | Media (6 consumidores) |
| [site-visits.service.ts](#f-comercial-jhoel-app-src-app-core-services-site-visits-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Contador anónimo y agregado de visitas a la landing pública — el backend es la única fuente de verdad (nunca `localStorage`/`sessionStorage`/ cookies). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [stats.service.ts](#f-comercial-jhoel-app-src-app-core-services-stats-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Credibility metrics shown right under the hero. | 2 internas; ext.: @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [supplier.service.ts](#f-comercial-jhoel-app-src-app-core-services-supplier-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `SupplierService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 6 | Media (6 consumidores) |
| [theme.service.ts](#f-comercial-jhoel-app-src-app-core-services-theme-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | The single source of truth for "Light Mode / Dark Mode" across the frontend — no component should read or write the `data-theme` attribute or `localStorage` directly; everything goes through here (see the toggle button in `DashboardTopbarComponent`). | 3 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [tickets.service.ts](#f-comercial-jhoel-app-src-app-core-services-tickets-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | A Ticket is explicitly NOT a real sale — this service only ever calls `/tickets`, never `/sales` or `/inventory`. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [transaction-bank.service.ts](#f-comercial-jhoel-app-src-app-core-services-transaction-bank-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | URL pública del logo (un `&lt;img&gt;` no puede mandar el token), o `null` si no tiene. | 2 internas; ext.: @angular/common, @angular/core, rxjs | 7 | Media (7 consumidores) |
| [transaction-type.service.ts](#f-comercial-jhoel-app-src-app-core-services-transaction-type-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `TransactionTypeService`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 4 | Media (4 consumidores) |
| [unit-of-measure.service.ts](#f-comercial-jhoel-app-src-app-core-services-unit-of-measure-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `UnitOfMeasureService`, `toParams`, `BASE_URL` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 3 | Media (3 consumidores) |
| [user.service.ts](#f-comercial-jhoel-app-src-app-core-services-user-service-ts) | .ts | Servicio | Core (servicios, modelos, guards) | Servicio: declara `UserService`, `BASE_URL`, `LIST_LIMIT` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/common, @angular/core, rxjs | 8 | Media (8 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-core-services-account-receivable-payment-service-ts"></a>

### account-receivable-payment.service.ts

- **Ruta:** [account-receivable-payment.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts) (`comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts`, 81 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Cuentas por Cobrar → "Cancelar cuenta(s)" API client.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts), [settlement-modal.component.spec.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-spec-ts), [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts)

#### Clase `AccountReceivablePaymentService` (L36–80)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Cuentas por Cobrar → "Cancelar cuenta(s)" API client. Pendings, totals and resulting cash/bank balances always come from the backend; this layer never recalculates a balance.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getPendingCharges` | método public | 41–45 | `clientId: string` | `Observable<ClientPendingCharges>` |
| `preview` | método public | 48–50 | `input: SettlementPreviewInput` | `Observable<SettlementPreview>` |
| `settle` | método public | 53–55 | `input: SettleAccountsReceivableInput` | `Observable<SettlementResult>` |
| `getSettlements` | método public | 57–61 | `filters?: SettlementFilters` | `Observable<PaginatedSettlements>` |
| `getSettlement` | método public | 63–65 | `id: string` | `Observable<SettlementWithDetails>` |
| `getChargeHistory` | método public | 68–72 | `chargeId: string` | `Observable<ChargePaymentHistory>` |
| `voidSettlement` | método public | 75–79 | `id: string`, `reason: string` | `Observable<SettlementResult>` |

##### `AccountReceivablePaymentService.getPendingCharges`

- **Firma:** `getPendingCharges(clientId: string): Observable<ClientPendingCharges>` — [account-receivable-payment.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts#L41) (L41–45)
- **Propósito / descripción:** Accounts of a client that still have something to collect.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/clients/${clientId}/pending'`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts)

##### `AccountReceivablePaymentService.preview`

- **Firma:** `preview(input: SettlementPreviewInput): Observable<SettlementPreview>` — [account-receivable-payment.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts#L48) (L48–50)
- **Propósito / descripción:** Summary before confirming (no write): pendings, total and resulting balance.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<SettlementPreview>>('${BASE_URL}/preview', input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/preview'`
- **Consumidores:** [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts)

##### `AccountReceivablePaymentService.settle`

- **Firma:** `settle(input: SettleAccountsReceivableInput): Observable<SettlementResult>` — [account-receivable-payment.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts#L53) (L53–55)
- **Propósito / descripción:** Cancels the selected accounts in one backend transaction (idempotent by `clientRequestId`).
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<SettlementResult>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts)

##### `AccountReceivablePaymentService.getSettlements`

- **Firma:** `getSettlements(filters?: SettlementFilters): Observable<PaginatedSettlements>` — [account-receivable-payment.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts#L57) (L57–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivablePaymentService.getSettlement`

- **Firma:** `getSettlement(id: string): Observable<SettlementWithDetails>` — [account-receivable-payment.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<SettlementWithDetails>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts)

##### `AccountReceivablePaymentService.getChargeHistory`

- **Firma:** `getChargeHistory(chargeId: string): Observable<ChargePaymentHistory>` — [account-receivable-payment.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts#L68) (L68–72)
- **Propósito / descripción:** Payment history of one account.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/charges/${chargeId}'`
- **Consumidores:** [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts)

##### `AccountReceivablePaymentService.voidSettlement`

- **Firma:** `voidSettlement(id: string, reason: string): Observable<SettlementResult>` — [account-receivable-payment.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts#L75) (L75–79)
- **Propósito / descripción:** Admin: reverses the collection (cash or bank) and makes the accounts pending again.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/void'`
- **Consumidores:** [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts)

#### Función `toParams` (L21–29)

- **Tipo:** función local del archivo
- **Firma:** `toParams(filters: object): HttpParams` — [account-receivable-payment.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts#L21)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new HttpParams`, `Object.entries`, `params.set`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-account-receivable-service-ts"></a>

### account-receivable.service.ts

- **Ruta:** [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts) (`comercial-jhoel-app/src/app/core/services/account-receivable.service.ts`, 100 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Drops `undefined`/empty-string values — `HttpParams` would otherwise send the literal string `"undefined"` as a query value.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts)

#### Clase `AccountReceivableService` (L32–99)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Herencia / contratos:** implements KardexAccountService
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getAccountsReceivable` | método public | 36–42 | `filters?: AccountReceivableFilters` | `Observable<PaginatedAccountsReceivable>` |
| `getAccountReceivableById` | método public | 44–48 | `id: string` | `Observable<AccountReceivable>` |
| `createAccountReceivable` | método public | 50–54 | `input: AccountReceivableInput` | `Observable<AccountReceivable>` |
| `updateAccountReceivable` | método public | 56–60 | `id: string`, `input: AccountReceivableInput` | `Observable<AccountReceivable>` |
| `deleteAccountReceivable` | método public | 63–65 | `id: string` | `Observable<void>` |
| `registerCharge` | método public | 68–72 | `clientId: string`, `input: RegisterKardexMovementInput` | `Observable<AccountReceivable>` |
| `registerPayment` | método public | 75–79 | `clientId: string`, `input: RegisterKardexMovementInput` | `Observable<AccountReceivable>` |
| `getStatement` | método public | 81–85 | `clientId: string`, `filters?: KardexStatementFilters` | `Observable<KardexStatement>` |
| `getCurrentBalance` | método public | 87–91 | `clientId: string` | `Observable<number>` |
| `getActiveBalance` | método public | 94–98 | — | `Observable<ActiveBalanceSummary>` |

##### `AccountReceivableService.getAccountsReceivable`

- **Firma:** `getAccountsReceivable(filters?: AccountReceivableFilters): Observable<PaginatedAccountsReceivable>` — [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts#L36) (L36–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts)

##### `AccountReceivableService.getAccountReceivableById`

- **Firma:** `getAccountReceivableById(id: string): Observable<AccountReceivable>` — [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts#L44) (L44–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<AccountReceivable>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivableService.createAccountReceivable`

- **Firma:** `createAccountReceivable(input: AccountReceivableInput): Observable<AccountReceivable>` — [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts#L50) (L50–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<AccountReceivable>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts)

##### `AccountReceivableService.updateAccountReceivable`

- **Firma:** `updateAccountReceivable(id: string, input: AccountReceivableInput): Observable<AccountReceivable>` — [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts#L56) (L56–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<AccountReceivable>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts)

##### `AccountReceivableService.deleteAccountReceivable`

- **Firma:** `deleteAccountReceivable(id: string): Observable<void>` — [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts#L63) (L63–65)
- **Propósito / descripción:** Soft delete — the backend deactivates the record, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts)

##### `AccountReceivableService.registerCharge`

- **Firma:** `registerCharge(clientId: string, input: RegisterKardexMovementInput): Observable<AccountReceivable>` — [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts#L68) (L68–72)
- **Propósito / descripción:** "Registrar Cargo" — an independent Kardex movement, never a rewrite of a prior one.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${clientId}/charges'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivableService.registerPayment`

- **Firma:** `registerPayment(clientId: string, input: RegisterKardexMovementInput): Observable<AccountReceivable>` — [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts#L75) (L75–79)
- **Propósito / descripción:** "Registrar Abono" — the backend rejects an amount exceeding the client's current balance.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${clientId}/payments'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivableService.getStatement`

- **Firma:** `getStatement(clientId: string, filters?: KardexStatementFilters): Observable<KardexStatement>` — [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts#L81) (L81–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${clientId}/statement'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivableService.getCurrentBalance`

- **Firma:** `getCurrentBalance(clientId: string): Observable<number>` — [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts#L87) (L87–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${clientId}/balance'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountReceivableService.getActiveBalance`

- **Firma:** `getActiveBalance(): Observable<ActiveBalanceSummary>` — [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts#L94) (L94–98)
- **Propósito / descripción:** Saldo total — active accounts only, regardless of the list's own current filters.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<ActiveBalanceSummary>>('${BASE_URL}/summary').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/summary'`
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts)

#### Función `toParams` (L22–30)

- **Tipo:** función local del archivo
- **Firma:** `toParams(filters: object): HttpParams` — [account-receivable.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-receivable.service.ts#L22)
- **Propósito / descripción:** Drops `undefined`/empty-string values — `HttpParams` would otherwise send the literal string `"undefined"` as a query value.
- **Dependencias:** `new HttpParams`, `Object.entries`, `params.set`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-account-type-service-ts"></a>

### account-type.service.ts

- **Ruta:** [account-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-type.service.ts) (`comercial-jhoel-app/src/app/core/services/account-type.service.ts`, 40 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `AccountTypeService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [account-type-form-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts), [banks-page.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts)

#### Clase `AccountTypeService` (L10–39)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getAccountTypes` | método public | 15–19 | `includeInactive?` | `Observable<AccountType[]>` |
| `getAccountTypeById` | método public | 21–23 | `id: string` | `Observable<AccountType>` |
| `createAccountType` | método public | 25–27 | `input: AccountTypeInput` | `Observable<AccountType>` |
| `updateAccountType` | método public | 29–33 | `id: string`, `input: AccountTypeInput` | `Observable<AccountType>` |
| `deleteAccountType` | método public | 36–38 | `id: string` | `Observable<void>` |

##### `AccountTypeService.getAccountTypes`

- **Firma:** `getAccountTypes(includeInactive?): Observable<AccountType[]>` — [account-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-type.service.ts#L15) (L15–19)
- **Propósito / descripción:** Active-only by default — what the bank form's dropdown should offer.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts)

##### `AccountTypeService.getAccountTypeById`

- **Firma:** `getAccountTypeById(id: string): Observable<AccountType>` — [account-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-type.service.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<AccountType>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountTypeService.createAccountType`

- **Firma:** `createAccountType(input: AccountTypeInput): Observable<AccountType>` — [account-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-type.service.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<AccountType>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [account-type-form-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts)

##### `AccountTypeService.updateAccountType`

- **Firma:** `updateAccountType(id: string, input: AccountTypeInput): Observable<AccountType>` — [account-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-type.service.ts#L29) (L29–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<AccountType>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [account-type-form-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts)

##### `AccountTypeService.deleteAccountType`

- **Firma:** `deleteAccountType(id: string): Observable<void>` — [account-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/account-type.service.ts#L36) (L36–38)
- **Propósito / descripción:** Soft delete — the backend deactivates the account type, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-alert-settings-service-ts"></a>

### alert-settings.service.ts

- **Ruta:** [alert-settings.service.ts](../../../../comercial-jhoel-app/src/app/core/services/alert-settings.service.ts) (`comercial-jhoel-app/src/app/core/services/alert-settings.service.ts`, 24 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `AlertSettingsService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts)

#### Clase `AlertSettingsService` (L10–23)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSettings` | método public | 14–16 | — | `Observable<AlertSettings>` |
| `updateSettings` | método public | 18–22 | `input: UpdateAlertSettingsInput` | `Observable<AlertSettings>` |

##### `AlertSettingsService.getSettings`

- **Firma:** `getSettings(): Observable<AlertSettings>` — [alert-settings.service.ts](../../../../comercial-jhoel-app/src/app/core/services/alert-settings.service.ts#L14) (L14–16)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<AlertSettings>>(BASE_URL).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts)

##### `AlertSettingsService.updateSettings`

- **Firma:** `updateSettings(input: UpdateAlertSettingsInput): Observable<AlertSettings>` — [alert-settings.service.ts](../../../../comercial-jhoel-app/src/app/core/services/alert-settings.service.ts#L18) (L18–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<AlertSettings>>(BASE_URL, input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `BASE_URL`
- **Consumidores:** [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-alerts-service-ts"></a>

### alerts.service.ts

- **Ruta:** [alerts.service.ts](../../../../comercial-jhoel-app/src/app/core/services/alerts.service.ts) (`comercial-jhoel-app/src/app/core/services/alerts.service.ts`, 28 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `AlertsService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [alert-bell.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-components-alert-bell-alert-bell-component-ts)

#### Clase `AlertsService` (L10–27)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getAlerts` | método public | 14–18 | — | `Observable<AlertsResult>` |
| `markAsRead` | método public | 20–22 | `key: string` | `Observable<void>` |
| `markAllAsRead` | método public | 24–26 | — | `Observable<void>` |

##### `AlertsService.getAlerts`

- **Firma:** `getAlerts(): Observable<AlertsResult>` — [alerts.service.ts](../../../../comercial-jhoel-app/src/app/core/services/alerts.service.ts#L14) (L14–18)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<AlertsResult>>(BASE_URL).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [alert-bell.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-components-alert-bell-alert-bell-component-ts)

##### `AlertsService.markAsRead`

- **Firma:** `markAsRead(key: string): Observable<void>` — [alerts.service.ts](../../../../comercial-jhoel-app/src/app/core/services/alerts.service.ts#L20) (L20–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `encodeURIComponent`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${encodeURIComponent(key)}/read'`
- **Consumidores:** [alert-bell.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-components-alert-bell-alert-bell-component-ts)

##### `AlertsService.markAllAsRead`

- **Firma:** `markAllAsRead(): Observable<void>` — [alerts.service.ts](../../../../comercial-jhoel-app/src/app/core/services/alerts.service.ts#L24) (L24–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/read-all'`
- **Consumidores:** [alert-bell.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-components-alert-bell-alert-bell-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-app-update-service-ts"></a>

### app-update.service.ts

- **Ruta:** [app-update.service.ts](../../../../comercial-jhoel-app/src/app/core/services/app-update.service.ts) (`comercial-jhoel-app/src/app/core/services/app-update.service.ts`, 163 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Detecta y aplica actualizaciones del Service Worker de Angular (`ngsw-worker.js` — el único que existe, ver `app.config.ts`) para que una PWA instalada deje de quedarse atrapada en una versión vieja hasta que el cliente la cierre y reabra manualmente.
- **Depende de (archivos del proyecto):** [bank-balance-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-balance-draft-store-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [ice-cream-purchase-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-purchase-draft-store-ts), [ice-cream-sale-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-sale-draft-store-ts), [purchase-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchase-draft-store-ts), [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts)
- **Paquetes externos:** `@angular/core`, `@angular/service-worker`, `rxjs`
- **Consumidores:** [app.component.ts](root.md#f-comercial-jhoel-app-src-app-app-component-ts), [update-available-banner.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-update-available-banner-update-available-banner-component-ts)

#### Clase `AppUpdateService` (L57–162)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Detecta y aplica actualizaciones del Service Worker de Angular (`ngsw-worker.js` — el único que existe, ver `app.config.ts`) para que una PWA instalada deje de quedarse atrapada en una versión vieja hasta que el cliente la cierre y reabra manualmente. No inventa un esquema de versión propio — reutiliza el mecanismo real que `@angular/service-worker` ya trae integrado: el hash de contenido de `ngsw.json` que Angular genera en cada build (`VersionReadyEvent. latestVersion.hash`). Un `package.json.version`/`environment.version` manual habría sido una segunda fuente de verdad redundante y propensa a quedar desactualizada si alguien olvida incrementarla. Estrategia de detección (nunca polling agresivo): - Al arrancar, una vez que la app ya está estable. - Cada 6h mientras la pestaña siga abierta (mismo intervalo que la guía oficial de Angular). - Al volver a primer plano (`visibilitychange`) 
- **Servicios inyectados con `inject()`:** `swUpdate = inject(SwUpdate)`, `appRef = inject(ApplicationRef)`, `salesDraftStore = inject(SalesDraftStore)`, `purchaseDraftStore = inject(PurchaseDraftStore)`, `bankDepositDraftStore = inject(BankDepositDraftStore)`, `bankBalanceDraftStore = inject(BankBalanceDraftStore)`, `iceCreamPurchaseDraftStore = inject(IceCreamPurchaseDraftStore)`, `iceCreamSaleDraftStore = inject(IceCreamSaleDraftStore)`
- **Datos / estado que administra:** `updateReady = signal(false)`, `dismissed = signal(false)`, `hasUnsavedWork = computed( () => this.salesDraftStore.hasActiveDraf`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `checkForUpdateThrottled` | método private | 115–126 | — | `void` |
| `onVersionReady` | método private | 128–135 | — | `void` |
| `applyUpdate` | método public async | 144–157 | — | `Promise<void>` |
| `dismiss` | método public | 159–161 | — | `void` |

##### `AppUpdateService.checkForUpdateThrottled`

- **Firma:** `checkForUpdateThrottled(): void` — [app-update.service.ts](../../../../comercial-jhoel-app/src/app/core/services/app-update.service.ts#L115) (L115–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Date.now`, `this.swUpdate.checkForUpdate().catch`, `this.swUpdate.checkForUpdate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AppUpdateService.onVersionReady`

- **Firma:** `onVersionReady(): void` — [app-update.service.ts](../../../../comercial-jhoel-app/src/app/core/services/app-update.service.ts#L128) (L128–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateReady.set`, `this.hasUnsavedWork`, `this.applyUpdate`
- **Efectos secundarios:** Actualiza estado (signals): `this.updateReady.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AppUpdateService.applyUpdate`

- **Firma:** `applyUpdate(): Promise<void>` — [app-update.service.ts](../../../../comercial-jhoel-app/src/app/core/services/app-update.service.ts#L144) (L144–157)
- **Propósito / descripción:** Activa la versión nueva y recarga UNA sola vez — el patrón exacto que recomienda la guía oficial de Angular (`activateUpdate()` seguido de un reload; nunca actualizar sin recargar, por el riesgo real de mezclar `index.html`/chunks de dos versiones distintas). El guard de `sessionStorage` es la protección explícita contra un loop de recargas.
- **Dependencias (llamadas en su cuerpo):** `Number`, `sessionStorage.getItem`, `Date.now`, `console.warn`, `this.swUpdate.activateUpdate`, `sessionStorage.setItem`, `String`, `document.location.reload`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [update-available-banner.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-update-available-banner-update-available-banner-component-ts), (mismo archivo)

##### `AppUpdateService.dismiss`

- **Firma:** `dismiss(): void` — [app-update.service.ts](../../../../comercial-jhoel-app/src/app/core/services/app-update.service.ts#L159) (L159–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dismissed.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.dismissed.set`
- **Consumidores:** [update-available-banner.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-update-available-banner-update-available-banner-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-asset-service-ts"></a>

### asset.service.ts

- **Ruta:** [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts) (`comercial-jhoel-app/src/app/core/services/asset.service.ts`, 94 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Drops `undefined`/empty-string values — `HttpParams` would otherwise send the literal string `"undefined"` as a query value.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [asset-form-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts)

#### Clase `AssetService` (L32–93)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Herencia / contratos:** implements KardexAccountService
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getAssets` | método public | 36–40 | `filters?: AssetFilters` | `Observable<PaginatedAssets>` |
| `getAssetById` | método public | 42–44 | `id: string` | `Observable<Asset>` |
| `createAsset` | método public | 46–48 | `input: AssetInput` | `Observable<Asset>` |
| `updateAsset` | método public | 50–54 | `id: string`, `input: AssetInput` | `Observable<Asset>` |
| `deleteAsset` | método public | 57–59 | `id: string` | `Observable<void>` |
| `registerCharge` | método public | 62–66 | `clientId: string`, `input: RegisterKardexMovementInput` | `Observable<Asset>` |
| `registerPayment` | método public | 69–73 | `clientId: string`, `input: RegisterKardexMovementInput` | `Observable<Asset>` |
| `getStatement` | método public | 75–79 | `clientId: string`, `filters?: KardexStatementFilters` | `Observable<KardexStatement>` |
| `getCurrentBalance` | método public | 81–85 | `clientId: string` | `Observable<number>` |
| `getActiveBalance` | método public | 88–92 | — | `Observable<ActiveBalanceSummary>` |

##### `AssetService.getAssets`

- **Firma:** `getAssets(filters?: AssetFilters): Observable<PaginatedAssets>` — [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts#L36) (L36–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts)

##### `AssetService.getAssetById`

- **Firma:** `getAssetById(id: string): Observable<Asset>` — [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Asset>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetService.createAsset`

- **Firma:** `createAsset(input: AssetInput): Observable<Asset>` — [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Asset>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [asset-form-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts)

##### `AssetService.updateAsset`

- **Firma:** `updateAsset(id: string, input: AssetInput): Observable<Asset>` — [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts#L50) (L50–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<Asset>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [asset-form-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts)

##### `AssetService.deleteAsset`

- **Firma:** `deleteAsset(id: string): Observable<void>` — [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts#L57) (L57–59)
- **Propósito / descripción:** Soft delete — the backend deactivates the record, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts)

##### `AssetService.registerCharge`

- **Firma:** `registerCharge(clientId: string, input: RegisterKardexMovementInput): Observable<Asset>` — [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts#L62) (L62–66)
- **Propósito / descripción:** "Registrar Cargo" — an independent Kardex movement, never a rewrite of a prior one.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Asset>>('${BASE_URL}/${clientId}/charges', input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${clientId}/charges'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetService.registerPayment`

- **Firma:** `registerPayment(clientId: string, input: RegisterKardexMovementInput): Observable<Asset>` — [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts#L69) (L69–73)
- **Propósito / descripción:** "Registrar Abono" — unlike Cuentas por Cobrar, Activos allows the resulting balance to go negative.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Asset>>('${BASE_URL}/${clientId}/payments', input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${clientId}/payments'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetService.getStatement`

- **Firma:** `getStatement(clientId: string, filters?: KardexStatementFilters): Observable<KardexStatement>` — [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts#L75) (L75–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${clientId}/statement'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetService.getCurrentBalance`

- **Firma:** `getCurrentBalance(clientId: string): Observable<number>` — [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts#L81) (L81–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${clientId}/balance'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AssetService.getActiveBalance`

- **Firma:** `getActiveBalance(): Observable<ActiveBalanceSummary>` — [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts#L88) (L88–92)
- **Propósito / descripción:** Saldo total — active accounts only, regardless of the list's own current filters.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<ActiveBalanceSummary>>('${BASE_URL}/summary').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/summary'`
- **Consumidores:** [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts)

#### Función `toParams` (L22–30)

- **Tipo:** función local del archivo
- **Firma:** `toParams(filters: object): HttpParams` — [asset.service.ts](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts#L22)
- **Propósito / descripción:** Drops `undefined`/empty-string values — `HttpParams` would otherwise send the literal string `"undefined"` as a query value.
- **Dependencias:** `new HttpParams`, `Object.entries`, `params.set`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-assets-receivables-report-state-service-ts"></a>

### assets-receivables-report-state.service.ts

- **Ruta:** [assets-receivables-report-state.service.ts](../../../../comercial-jhoel-app/src/app/core/services/assets-receivables-report-state.service.ts) (`comercial-jhoel-app/src/app/core/services/assets-receivables-report-state.service.ts`, 53 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Holds the Reportería de Activos y Cuentas por Cobrar page's checkboxes, filters, and last-fetched results in a root-provided singleton — the same `providedIn: 'root'` + signals technique `PurchaseDraftStore`/ `SalesDraftStore` already established for surviving component destruction on route navigation (see those services' own doc comments).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts)

#### Clase `AssetsReceivablesReportStateService` (L17–52)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Holds the Reportería de Activos y Cuentas por Cobrar page's checkboxes, filters, and last-fetched results in a root-provided singleton — the same `providedIn: 'root'` + signals technique `PurchaseDraftStore`/ `SalesDraftStore` already established for surviving component destruction on route navigation (see those services' own doc comments). Unlike a purchase/sale draft, there is nothing here to persist to `sessionStorage`: this is read-only report state, not data the user is building up that could be lost on an accidental reload — losing it just means re-clicking "Consultar", so an in-memory signal is enough.
- **Datos / estado que administra:** `draftIncludeAssets = signal(true)`, `draftIncludeReceivables = signal(true)`, `draftClient = signal<Client \| null>(null)`, `draftStartDate = signal('')`, `draftEndDate = signal('')`, `draftStatus = signal<ReportStatusFilter>('all')`, `draftSearch = signal('')`, `includeAssets = signal(true)`, `includeReceivables = signal(true)`, `client = signal<Client \| null>(null)`, `startDate = signal('')`, `endDate = signal('')`, `status = signal<ReportStatusFilter>('all')`, `search = signal('')`, `page = signal(1)`, `rows = signal<AssetsReceivablesReportRow[]>([])`, `total = signal(0)`, `summary = signal<AssetsReceivablesReportSummary \| null>(null`, `hasQueried = signal(false)`, `loadingTable = signal(false)`, `loadingSummary = signal(false)`, `exporting = signal(false)`
<a id="f-comercial-jhoel-app-src-app-core-services-auth-service-ts"></a>

### auth.service.ts

- **Ruta:** [auth.service.ts](../../../../comercial-jhoel-app/src/app/core/services/auth.service.ts) (`comercial-jhoel-app/src/app/core/services/auth.service.ts`, 120 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `AuthService`, `AuthUser`, `AuthResult`, `LoginResponse`, `UserRole` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [theme.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-theme-service-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [admin.guard.ts](core-guards.md#f-comercial-jhoel-app-src-app-core-guards-admin-guard-ts), [auth.guard.ts](core-guards.md#f-comercial-jhoel-app-src-app-core-guards-auth-guard-ts), [guest.guard.ts](core-guards.md#f-comercial-jhoel-app-src-app-core-guards-guest-guard-ts), [auth.interceptor.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-auth-interceptor-ts), [bank-balance-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-balance-draft-store-ts), [bank-deposit-draft.store.spec.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-spec-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts), [ice-cream-purchase-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-purchase-draft-store-ts), [ice-cream-sale-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-ice-cream-sale-draft-store-ts), [purchase-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-purchase-draft-store-ts), [login-page.component.ts](auth.md#f-comercial-jhoel-app-src-app-features-auth-login-login-page-component-ts), [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts) y 37 más

**Interfaces, tipos y enums:**

- `interface AuthUser` (L14): sin documentación — miembros: `id`, `username`, `phone`, `role`
- `interface AuthResult` (L21): sin documentación — miembros: `success`, `error`
- `interface LoginResponse` (L26): sin documentación — miembros: `accessToken`, `user`
- `type UserRole` (L10) = `'SUPER_ADMIN' \| 'ADMIN' \| 'USER'`

#### Clase `AuthService` (L39–119)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`, `themeService = inject(ThemeService)`
- **Datos / estado que administra:** `currentUser = signal<AuthUser \| null>(this.restoreSession())`, `isAuthenticated = computed(() => this.currentUser() !== null)`, `isAdmin = computed(() => ADMIN_ROLES.includes(this.currentUs`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `login` | método public | 61–74 | `identifier: string`, `password: string` | `Observable<AuthResult>` |
| `changePassword` | método public | 76–88 | `currentPassword: string`, `newPassword: string` | `Observable<AuthResult>` |
| `logout` | método public | 90–95 | — | `void` |
| `getToken` | método public | 97–99 | — | `string \| null` |
| `setSession` | método private | 101–105 | `accessToken: string`, `user: AuthUser` | `void` |
| `restoreSession` | método private | 107–118 | — | `AuthUser \| null` |

##### `AuthService.login`

- **Firma:** `login(identifier: string, password: string): Observable<AuthResult>` — [auth.service.ts](../../../../comercial-jhoel-app/src/app/core/services/auth.service.ts#L61) (L61–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `tap`, `this.setSession`, `this.themeService.loadUserTheme`, `map`, `catchError`, `of`, `extractErrorMessage`
- **Efectos secundarios:** HTTP: POST `'${environment.apiUrl}/auth/login'`
- **Consumidores:** [login-page.component.ts](auth.md#f-comercial-jhoel-app-src-app-features-auth-login-login-page-component-ts)

##### `AuthService.changePassword`

- **Firma:** `changePassword(currentPassword: string, newPassword: string): Observable<AuthResult>` — [auth.service.ts](../../../../comercial-jhoel-app/src/app/core/services/auth.service.ts#L76) (L76–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`, `catchError`, `of`, `extractErrorMessage`
- **Efectos secundarios:** HTTP: POST `'${environment.apiUrl}/auth/change-password'`
- **Consumidores:** [change-password-modal.component.ts](dashboard-change-password-modal.md#f-comercial-jhoel-app-src-app-features-dashboard-change-password-modal-change-password-modal-component-ts)

##### `AuthService.logout`

- **Firma:** `logout(): void` — [auth.service.ts](../../../../comercial-jhoel-app/src/app/core/services/auth.service.ts#L90) (L90–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.currentUser.set`, `localStorage.removeItem`, `this.themeService.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.currentUser.set`
- **Consumidores:** [auth.interceptor.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-auth-interceptor-ts), [dashboard-layout.component.ts](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts)

##### `AuthService.getToken`

- **Firma:** `getToken(): string \| null` — [auth.service.ts](../../../../comercial-jhoel-app/src/app/core/services/auth.service.ts#L97) (L97–99)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `localStorage.getItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [auth.interceptor.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-auth-interceptor-ts)

##### `AuthService.setSession`

- **Firma:** `setSession(accessToken: string, user: AuthUser): void` — [auth.service.ts](../../../../comercial-jhoel-app/src/app/core/services/auth.service.ts#L101) (L101–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `localStorage.setItem`, `JSON.stringify`, `this.currentUser.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.currentUser.set`
- **Consumidores:** (mismo archivo)

##### `AuthService.restoreSession`

- **Firma:** `restoreSession(): AuthUser \| null` — [auth.service.ts](../../../../comercial-jhoel-app/src/app/core/services/auth.service.ts#L107) (L107–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `localStorage.getItem`, `JSON.parse`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-bank-agent-service-ts"></a>

### bank-agent.service.ts

- **Ruta:** [bank-agent.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-agent.service.ts) (`comercial-jhoel-app/src/app/core/services/bank-agent.service.ts`, 26 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Backs the public landing page's "Agente Bancario" marketing section (`features/landing/sections/bank-agents/`) — static service-offering copy (deposits, withdrawals, bill pay...), unrelated to the internal "Agentes Bancarios" → Cuadre Agentes admin module (`BankService`/ `BankBalanceService`/`CuadreAgentesService`) despite the similar name.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [bank-agents.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts)

#### Clase `BankAgentService` (L16–25)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Backs the public landing page's "Agente Bancario" marketing section (`features/landing/sections/bank-agents/`) — static service-offering copy (deposits, withdrawals, bill pay...), unrelated to the internal "Agentes Bancarios" → Cuadre Agentes admin module (`BankService`/ `BankBalanceService`/`CuadreAgentesService`) despite the similar name. Phase 2: replace the `of(...)` bodies with calls to `${environment.apiUrl}/bank-agent/*`.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getOperations` | método public | 18–20 | — | `Observable<BankOperation[]>` |
| `getTrustPoints` | método public | 22–24 | — | (inferido) |

##### `BankAgentService.getOperations`

- **Firma:** `getOperations(): Observable<BankOperation[]>` — [bank-agent.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-agent.service.ts#L18) (L18–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `of`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankAgentService.getTrustPoints`

- **Firma:** `getTrustPoints()` — [bank-agent.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-agent.service.ts#L22) (L22–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `of`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-bank-balance-draft-store-ts"></a>

### bank-balance-draft.store.ts

- **Ruta:** [bank-balance-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance-draft.store.ts) (`comercial-jhoel-app/src/app/core/services/bank-balance-draft.store.ts`, 140 líneas)
- **Tipo:** Store (estado) · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** The in-progress "Agentes Bancarios → Bancos" cuadre — same root-provided, sessionStorage-backed singleton pattern as `PurchaseDraftStore`/ `IceCreamPurchaseDraftStore` (see those files' own doc comments for the full reasoning): nothing is sent to the backend until "Guardar Cambios", and navigating away and back must never lose what was typed.
- **Depende de (archivos del proyecto):** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app-update.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-app-update-service-ts), [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [cuadre-agentes-page.component.spec.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-spec-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [dashboard-sidebar.component.ts](dashboard-sidebar.md#f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts)

**Interfaces, tipos y enums:**

- `interface PersistedBankBalanceDraft` (L14): sin documentación — miembros: `operationDate`, `draftFinalBalances`

#### Clase `BankBalanceDraftStore` (L42–139)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** The in-progress "Agentes Bancarios → Bancos" cuadre — same root-provided, sessionStorage-backed singleton pattern as `PurchaseDraftStore`/ `IceCreamPurchaseDraftStore` (see those files' own doc comments for the full reasoning): nothing is sent to the backend until "Guardar Cambios", and navigating away and back must never lose what was typed. Only *entered* saldo final values live here — bank name/account number/tipo/saldo anterior are always re-fetched from the backend (see `BankBalanceService.getBalancesView`), never persisted client-side, so this store can never drift from what Sistema → Bancos currently has configured. `operationDate` is now the single source of truth for the WHOLE "Agentes Bancarios" cycle, not just Bancos — `CuadreAgentesPageComponent` reads it too, so both screens always operate on the exact same date instead of each independently guessing "today" and risking a si
- **Servicios inyectados con `inject()`:** `authService = inject(AuthService)`
- **Datos / estado que administra:** `operationDate = signal(todayIsoDate())`, `draftFinalBalances = signal<Record<string, number>>({})`, `hasActiveDraft = computed(() => Object.keys(this.draftFinalBalances`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `setFinalBalance` | método public | 56–59 | `bankId: string`, `finalBalance: number` | `void` |
| `zeroAll` | método public | 68–77 | `bankIds: string[]` | `void` |
| `removeFinalBalance` | método public | 79–85 | `bankId: string` | `void` |
| `setOperationDate` | método public | 88–92 | `date: string` | `void` |
| `reset` | método public | 95–98 | — | `void` |
| `persist` | método private | 100–115 | — | `void` |
| `restore` | método private | 117–133 | — | `void` |
| `storageKey` | método private | 135–138 | — | `string \| null` |

##### `BankBalanceDraftStore.setFinalBalance`

- **Firma:** `setFinalBalance(bankId: string, finalBalance: number): void` — [bank-balance-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance-draft.store.ts#L56) (L56–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftFinalBalances.update`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftFinalBalances.update`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts)

##### `BankBalanceDraftStore.zeroAll`

- **Firma:** `zeroAll(bankIds: string[]): void` — [bank-balance-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance-draft.store.ts#L68) (L68–77)
- **Propósito / descripción:** "Poner Saldos en Cero" — sets every bank in the current list's draft to 0, in a single update. Only touches this store's temporary state (and its `sessionStorage` copy); never calls the backend on its own — real persistence still only happens when the user presses "Guardar Cambios".
- **Dependencias (llamadas en su cuerpo):** `this.draftFinalBalances.update`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftFinalBalances.update`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts)

##### `BankBalanceDraftStore.removeFinalBalance`

- **Firma:** `removeFinalBalance(bankId: string): void` — [bank-balance-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance-draft.store.ts#L79) (L79–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.draftFinalBalances.update`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftFinalBalances.update`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts)

##### `BankBalanceDraftStore.setOperationDate`

- **Firma:** `setOperationDate(date: string): void` — [bank-balance-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance-draft.store.ts#L88) (L88–92)
- **Propósito / descripción:** Picking another date must never mix its data with the previously viewed one — no local merge, just a clean slate for the new date (same rule Recargas' own date picker follows).
- **Dependencias (llamadas en su cuerpo):** `this.operationDate.set`, `this.draftFinalBalances.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.operationDate.set`, `this.draftFinalBalances.set`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

##### `BankBalanceDraftStore.reset`

- **Firma:** `reset(): void` — [bank-balance-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance-draft.store.ts#L95) (L95–98)
- **Propósito / descripción:** The only sanctioned way to clear a draft — called after a confirmed save. Wipes both the in-memory signal and the persisted sessionStorage entry for the entered values, but keeps the current operation date.
- **Dependencias (llamadas en su cuerpo):** `this.draftFinalBalances.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.draftFinalBalances.set`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

##### `BankBalanceDraftStore.persist`

- **Firma:** `persist(): void` — [bank-balance-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance-draft.store.ts#L100) (L100–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `this.operationDate`, `this.draftFinalBalances`, `sessionStorage.setItem`, `JSON.stringify`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `BankBalanceDraftStore.restore`

- **Firma:** `restore(): void` — [bank-balance-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance-draft.store.ts#L117) (L117–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `sessionStorage.getItem`, `JSON.parse`, `this.operationDate.set`, `todayIsoDate`, `this.draftFinalBalances.set`, `sessionStorage.removeItem`
- **Efectos secundarios:** Actualiza estado (signals): `this.operationDate.set`, `this.draftFinalBalances.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankBalanceDraftStore.storageKey`

- **Firma:** `storageKey(): string \| null` — [bank-balance-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance-draft.store.ts#L135) (L135–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.authService.currentUser`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `todayIsoDate` (L6–12)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [bank-balance-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance-draft.store.ts#L6)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique every other date-driven page in this app already uses (Recargas, Reports, Bancos).
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-bank-balance-service-ts"></a>

### bank-balance.service.ts

- **Ruta:** [bank-balance.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance.service.ts) (`comercial-jhoel-app/src/app/core/services/bank-balance.service.ts`, 26 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `BankBalanceService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts)

#### Clase `BankBalanceService` (L10–25)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getBalancesView` | método public | 15–19 | `operationDate: string` | `Observable<BankBalanceView[]>` |
| `saveBalances` | método public | 22–24 | `input: SaveBankBalancesInput` | `Observable<SaveBankBalancesResult>` |

##### `BankBalanceService.getBalancesView`

- **Firma:** `getBalancesView(operationDate: string): Observable<BankBalanceView[]>` — [bank-balance.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance.service.ts#L15) (L15–19)
- **Propósito / descripción:** Every active bank plus its resolved previous balance and whatever final balance is already saved for `operationDate`.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts)

##### `BankBalanceService.saveBalances`

- **Firma:** `saveBalances(input: SaveBankBalancesInput): Observable<SaveBankBalancesResult>` — [bank-balance.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-balance.service.ts#L22) (L22–24)
- **Propósito / descripción:** One atomic call — the backend's `save_bank_balance` function (once per entry, inside one outer transaction) resolves each bank's previous balance and records the cuadre.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<SaveBankBalancesResult>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-spec-ts"></a>

### bank-deposit-draft.store.spec.ts

- **Ruta:** [bank-deposit-draft.store.spec.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.spec.ts) (`comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.spec.ts`, 278 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Prueba unitaria: declara `USER_ID`, `STORAGE_KEY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [bank-deposit-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-ts"></a>

### bank-deposit-draft.store.ts

- **Ruta:** [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts) (`comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts`, 474 líneas)
- **Tipo:** Store (estado) · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** The in-progress "Transaccionar" deposit — a root-provided singleton so it survives route navigation, mirroring `PurchaseDraftStore`'s exact reasoning (see that store's own doc comment): Transaccionar has no server-side draft either — nothing is sent to the backend until "Confirmar y Guardar" — so th
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app-update.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-app-update-service-ts), [bank-deposit-draft.store.spec.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-draft-store-spec-ts), [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts), [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts), [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts), [warehouse-transfer-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-ts), [warehouse-withdrawal-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts), [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts), [cash-breakdown-table.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cash-breakdown-table-cash-breakdown-table-component-ts), [cuadre-result-card.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-cuadre-result-card-cuadre-result-card-component-ts), [status-indicator.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-status-indicator-status-indicator-component-ts), [transaction-distribution.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-transaction-distribution-transaction-distribution-component-ts), [transaccionar-page.component.spec.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-spec-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

**Interfaces, tipos y enums:**

- `interface PersistedBankDepositDraft` (L13): sin documentación — miembros: `transactionTypeId`, `transactionTypeName`, `transactionTypeBalanceEffect`, `transactionBankId`, `bankAccountId`, `totalAmount`, `cashBreakdownEnabled`, `cashCounts`, `transactionAmounts`, `clientName`, `description`, `clientId`, `clientDisplayName`, `sendToAccountsReceivable`, `sendToAssets`, `changeGiven`, `changeConfirmed`
- `type CuadreStatus` (L11) = `'red' \| 'yellow' \| 'green'`

**Constantes exportadas:**

- `DESCRIPTION_MAX_LENGTH` (L36): Max length of "Descripción / Beneficiario" (same as the API and the database column). = `250`

#### Clase `BankDepositDraftStore` (L63–473)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** The in-progress "Transaccionar" deposit — a root-provided singleton so it survives route navigation, mirroring `PurchaseDraftStore`'s exact reasoning (see that store's own doc comment): Transaccionar has no server-side draft either — nothing is sent to the backend until "Confirmar y Guardar" — so this store is the only place the in-progress operation lives, persisted to `sessionStorage` (not `localStorage`, same reasoning as Compras: real money data shouldn't linger indefinitely on a shared machine) scoped by the current user's id.
- **Servicios inyectados con `inject()`:** `authService = inject(AuthService)`
- **Datos / estado que administra:** `transactionTypeId = signal('')`, `transactionTypeName = signal('')`, `transactionBankId = signal('')`, `transactionTypeBalanceEffect = signal<TransactionTypeBalanceEffect \| null>(null)`, `bankAccountId = signal('')`, `isGenesisType = computed(() => isGenesisBalanceEffect(this.transac`, `needsBankAccount = computed(() => requiresBankAccount(this.transactio`, `totalAmount = signal(0)`, `cashBreakdownEnabled = signal(false)`, `cashCounts = signal<Record<string, number>>(emptyCashCounts())`, `transactionAmounts = signal<number[]>([0])`, `clientName = signal('')`, `description = signal('')`, `normalizedDescription = computed(() => normalizeDescription(this.descripti`, `descriptionError = computed<string \| null>(() => { const value = this`, `clientId = signal<string \| null>(null)`, `clientDisplayName = signal<string \| null>(null)`, `sendToAccountsReceivable = signal(false)`, `sendToAssets = signal(false)`, `changeGiven = signal(0)`, `changeConfirmed = signal(false)`, `totalCash = computed(() => round2( BANK_DEPOSIT_CASH_DENOMINAT`, `totalDistributed = computed(() => round2(this.transactionAmounts().re`, `excessAmount = computed(() => round2(this.totalCash() - round2(th`, `netCash = computed(() => this.changeConfirmed() ? round2(thi`, `hasPendingChange = computed( () => this.cashBreakdownEnabled() && !th`, `cashStatus = computed<CuadreStatus>(() => { const total = round`, `transactionsStatus = computed<CuadreStatus>(() => { const total = round`, `overallStatus = computed<CuadreStatus>(() => { const statuses = th`, `canSave = computed( () => this.transactionTypeId() !== '' &&`…

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `setTransactionType` | método public | 229–234 | `id: string`, `name: string`, `balanceEffect?: TransactionTypeBalanceEffect \| null` | `void` |
| `syncBalanceEffect` | método public | 237–242 | `balanceEffect: TransactionTypeBalanceEffect \| null` | `void` |
| `setBankAccount` | método public | 244–247 | `id: string` | `void` |
| `setTransactionBank` | método public | 249–252 | `id: string` | `void` |
| `setTotalAmount` | método public | 254–263 | `amount: number` | `void` |
| `setCashBreakdownEnabled` | método public | 266–274 | `enabled: boolean` | `void` |
| `setCashQuantity` | método public | 276–280 | `denomination: number`, `quantity: number` | `void` |
| `confirmChange` | método public | 283–287 | `amount: number` | `void` |
| `invalidateChange` | método private | 290–295 | — | `void` |
| `setTransactionCount` | método public | 307–321 | `count: number` | `void` |
| `setTransactionAmount` | método public | 323–328 | `index: number`, `amount: number` | `void` |
| `setClientName` | método public | 330–333 | `name: string` | `void` |
| `setDescription` | método public | 336–339 | `value: string` | `void` |
| `setRegisteredClient` | método public | 342–350 | `client: { id: string; name: string } \| null` | `void` |
| `setSendToAccountsReceivable` | método public | 352–358 | `value: boolean` | `void` |
| `setSendToAssets` | método public | 360–366 | `value: boolean` | `void` |
| `reset` | método public | 369–388 | — | `void` |
| `persist` | método private | 390–421 | — | `void` |
| `restore` | método private | 423–459 | — | `void` |
| `clearStorage` | método private | 461–466 | — | `void` |
| `storageKey` | método private | 469–472 | — | `string \| null` |

##### `BankDepositDraftStore.setTransactionType`

- **Firma:** `setTransactionType(id: string, name: string, balanceEffect?: TransactionTypeBalanceEffect \| null): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L229) (L229–234)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionTypeId.set`, `this.transactionTypeName.set`, `this.transactionTypeBalanceEffect.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionTypeId.set`, `this.transactionTypeName.set`, `this.transactionTypeBalanceEffect.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.syncBalanceEffect`

- **Firma:** `syncBalanceEffect(balanceEffect: TransactionTypeBalanceEffect \| null): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L237) (L237–242)
- **Propósito / descripción:** Re-sincroniza el efecto con el catálogo actual (un borrador restaurado puede venir de antes de este campo).
- **Dependencias (llamadas en su cuerpo):** `this.transactionTypeBalanceEffect`, `this.transactionTypeBalanceEffect.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionTypeBalanceEffect.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositDraftStore.setBankAccount`

- **Firma:** `setBankAccount(id: string): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L244) (L244–247)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankAccountId.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.bankAccountId.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.setTransactionBank`

- **Firma:** `setTransactionBank(id: string): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L249) (L249–252)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionBankId.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionBankId.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.setTotalAmount`

- **Firma:** `setTotalAmount(amount: number): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L254) (L254–263)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.totalAmount.set`, `this.invalidateChange`, `this.transactionAmounts`, `this.transactionAmounts.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.totalAmount.set`, `this.transactionAmounts.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.setCashBreakdownEnabled`

- **Firma:** `setCashBreakdownEnabled(enabled: boolean): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L266) (L266–274)
- **Propósito / descripción:** Turning the desglose OFF discards every typed quantity and any confirmed vuelto — nothing stale may reach the cuadre or the payload. Never touches `totalAmount` or the distribution.
- **Dependencias (llamadas en su cuerpo):** `this.cashBreakdownEnabled.set`, `this.cashCounts.set`, `emptyCashCounts`, `this.changeGiven.set`, `this.changeConfirmed.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashBreakdownEnabled.set`, `this.cashCounts.set`, `this.changeGiven.set`, `this.changeConfirmed.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.setCashQuantity`

- **Firma:** `setCashQuantity(denomination: number, quantity: number): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L276) (L276–280)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts.update`, `String`, `this.invalidateChange`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.update`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.confirmChange`

- **Firma:** `confirmChange(amount: number): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L283) (L283–287)
- **Propósito / descripción:** Called from "Confirmar vuelto" — the one and only place `changeConfirmed` becomes `true`. `amount` is always `excessAmount()` at the moment of confirming, passed in rather than re-read here so the modal's own displayed figure and the value actually stored can never drift apart.
- **Dependencias (llamadas en su cuerpo):** `this.changeGiven.set`, `round2`, `this.changeConfirmed.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.changeGiven.set`, `this.changeConfirmed.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.invalidateChange`

- **Firma:** `invalidateChange(): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L290) (L290–295)
- **Propósito / descripción:** Cash counts or the monto changed after a vuelto was confirmed — the old confirmation no longer means anything against new numbers, so it's cleared rather than silently carried forward. A no-op (and free) whenever nothing was confirmed yet.
- **Dependencias (llamadas en su cuerpo):** `this.changeConfirmed`, `this.changeGiven.set`, `this.changeConfirmed.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.changeGiven.set`, `this.changeConfirmed.set`
- **Consumidores:** (mismo archivo)

##### `BankDepositDraftStore.setTransactionCount`

- **Firma:** `setTransactionCount(count: number): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L307) (L307–321)
- **Propósito / descripción:** Resizes `transactionAmounts` to `count` rows. A single transaction never needs to be typed manually — it always equals the full `totalAmount`, so `count === 1` always rebuilds a fresh `[totalAmount]` regardless of what was there before (discarding any prior multi-row distribution, per this feature's own explicit rule). For every other count, the existing pad-with-`0`/truncate behavior is unchanged — the page component is still responsible for confirming with the user before calling this when shrinking would discard already-typed amounts.
- **Dependencias (llamadas en su cuerpo):** `this.transactionAmounts.set`, `round2`, `this.totalAmount`, `this.persist`, `this.transactionAmounts.update`, `amounts.slice`, `next.push`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionAmounts.set`, `this.transactionAmounts.update`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.setTransactionAmount`

- **Firma:** `setTransactionAmount(index: number, amount: number): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L323) (L323–328)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.transactionAmounts.update`, `amounts.map`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionAmounts.update`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.setClientName`

- **Firma:** `setClientName(name: string): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L330) (L330–333)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.clientName.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.clientName.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.setDescription`

- **Firma:** `setDescription(value: string): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L336) (L336–339)
- **Propósito / descripción:** Sets "Descripción / Beneficiario" (never longer than the limit).
- **Dependencias (llamadas en su cuerpo):** `this.description.set`, `(value ?? '').slice`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.description.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.setRegisteredClient`

- **Firma:** `setRegisteredClient(client: { id: string; name: string } \| null): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L342) (L342–350)
- **Propósito / descripción:** `client: null` (cleared from `ClientSearchSelectComponent`) also clears `sendToAccountsReceivable` — the checkbox never makes sense without a registered client, so there's nothing stale left checked once the client it referred to is gone.
- **Dependencias (llamadas en su cuerpo):** `this.clientId.set`, `this.clientDisplayName.set`, `this.sendToAccountsReceivable.set`, `this.sendToAssets.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.clientId.set`, `this.clientDisplayName.set`, `this.sendToAccountsReceivable.set`, `this.sendToAssets.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.setSendToAccountsReceivable`

- **Firma:** `setSendToAccountsReceivable(value: boolean): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L352) (L352–358)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sendToAccountsReceivable.set`, `this.sendToAssets.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.sendToAccountsReceivable.set`, `this.sendToAssets.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.setSendToAssets`

- **Firma:** `setSendToAssets(value: boolean): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L360) (L360–366)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sendToAssets.set`, `this.sendToAccountsReceivable.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.sendToAssets.set`, `this.sendToAccountsReceivable.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.reset`

- **Firma:** `reset(): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L369) (L369–388)
- **Propósito / descripción:** The only sanctioned way to clear a draft — called after a confirmed save, when going back to the type dashboard, or on logout.
- **Dependencias (llamadas en su cuerpo):** `this.transactionTypeId.set`, `this.transactionTypeName.set`, `this.transactionTypeBalanceEffect.set`, `this.transactionBankId.set`, `this.bankAccountId.set`, `this.totalAmount.set`, `this.cashBreakdownEnabled.set`, `this.cashCounts.set`, `emptyCashCounts`, `this.transactionAmounts.set`, `this.clientName.set`, `this.description.set`, `this.clientId.set`, `this.clientDisplayName.set`, `this.sendToAccountsReceivable.set`, `this.sendToAssets.set`, `this.changeGiven.set`, `this.changeConfirmed.set`…
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionTypeId.set`, `this.transactionTypeName.set`, `this.transactionTypeBalanceEffect.set`, `this.transactionBankId.set`, `this.bankAccountId.set`, `this.totalAmount.set`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositDraftStore.persist`

- **Firma:** `persist(): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L390) (L390–421)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `this.transactionTypeId`, `this.transactionTypeName`, `this.transactionTypeBalanceEffect`, `this.transactionBankId`, `this.bankAccountId`, `this.totalAmount`, `this.cashBreakdownEnabled`, `this.cashCounts`, `this.transactionAmounts`, `this.clientName`, `this.description`, `this.clientId`, `this.clientDisplayName`, `this.sendToAccountsReceivable`, `this.sendToAssets`, `this.changeGiven`, `this.changeConfirmed`…
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `BankDepositDraftStore.restore`

- **Firma:** `restore(): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L423) (L423–459)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `sessionStorage.getItem`, `JSON.parse`, `this.transactionTypeId.set`, `this.transactionTypeName.set`, `this.transactionBankId.set`, `this.transactionTypeBalanceEffect.set`, `this.bankAccountId.set`, `this.totalAmount.set`, `this.cashBreakdownEnabled.set`, `this.cashCounts.set`, `emptyCashCounts`, `Array.isArray`, `this.transactionAmounts.set`, `round2`, `this.clientName.set`, `this.description.set`, `(parsed.description ?? '').slice`…
- **Efectos secundarios:** Actualiza estado (signals): `this.transactionTypeId.set`, `this.transactionTypeName.set`, `this.transactionBankId.set`, `this.transactionTypeBalanceEffect.set`, `this.bankAccountId.set`, `this.totalAmount.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositDraftStore.clearStorage`

- **Firma:** `clearStorage(): void` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L461) (L461–466)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `sessionStorage.removeItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `BankDepositDraftStore.storageKey`

- **Firma:** `storageKey(): string \| null` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L469) (L469–472)
- **Propósito / descripción:** `null` when nobody is logged in yet — nothing to scope a key to, so persistence is silently skipped rather than falling back to a shared/anonymous key.
- **Dependencias (llamadas en su cuerpo):** `this.authService.currentUser`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `normalizeDescription` (L39–42)

- **Tipo:** función exportada
- **Firma:** `normalizeDescription(value: string): string` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L39)
- **Propósito / descripción:** Same normalization the API applies: control characters → space, collapse whitespace, trim.
- **Dependencias:** `(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim`, `(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace`, `(value ?? '').replace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `round2` (L45–47)

- **Tipo:** función local del archivo
- **Firma:** `round2(value: number): number` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L45)
- **Propósito / descripción:** Rounds to 2 decimals before comparing — plain float arithmetic on money (e.g. 0.1 + 0.2) can otherwise miss an exact match by a fraction of a centavo.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts), [guayacan-cash.util.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-util-ts)

#### Función `emptyCashCounts` (L49–51)

- **Tipo:** función local del archivo
- **Firma:** `emptyCashCounts(): Record<string, number>` — [bank-deposit-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit-draft.store.ts#L49)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Object.fromEntries`, `BANK_DEPOSIT_CASH_DENOMINATIONS.map`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts), [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts), [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts), [warehouse-transfer-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-ts), [warehouse-withdrawal-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts), [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts"></a>

### bank-deposit.service.ts

- **Ruta:** [bank-deposit.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts) (`comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts`, 86 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `BankDepositService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [daily-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-daily-transactions-chart-daily-transactions-chart-component-ts), [weekly-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-weekly-transactions-chart-weekly-transactions-chart-component-ts), [yearly-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-yearly-transactions-chart-yearly-transactions-chart-component-ts), [dashboard-home.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [bank-deposit-detail-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-bank-deposit-detail-modal-bank-deposit-detail-modal-component-ts), [transaccionar-page.component.spec.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-spec-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaction-monthly-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-transaction-monthly-chart-transaction-monthly-chart-component-ts)

#### Clase `BankDepositService` (L20–85)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `registerOperation` | método public | 25–29 | `input: RegisterBankDepositInput` | `Observable<BankDepositOperation>` |
| `getRecentOperations` | método public | 32–36 | — | `Observable<BankDepositOperationSummary[]>` |
| `getOperationById` | método public | 38–42 | `id: string` | `Observable<BankDepositOperation>` |
| `voidOperation` | método public | 45–49 | `id: string`, `reason: string` | `Observable<BankDepositOperation>` |
| `getMonthlyCount` | método public | 52–56 | — | `Observable<BankDepositMonthlyCount>` |
| `getTransactionSummary` | método public | 59–63 | — | `Observable<BankDepositTransactionSummary>` |
| `getDailyStats` | método public | 66–70 | — | `Observable<BankDepositDailyStats>` |
| `getWeeklyStats` | método public | 73–77 | — | `Observable<BankDepositWeeklyStats>` |
| `getYearlyStats` | método public | 80–84 | — | `Observable<BankDepositYearlyStats>` |

##### `BankDepositService.registerOperation`

- **Firma:** `registerOperation(input: RegisterBankDepositInput): Observable<BankDepositOperation>` — [bank-deposit.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts#L25) (L25–29)
- **Propósito / descripción:** The backend recomputes/validates the cash and transaction totals server-side — this call can still fail with a real cuadre error even if the form looked balanced client-side.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<BankDepositOperation>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositService.getRecentOperations`

- **Firma:** `getRecentOperations(): Observable<BankDepositOperationSummary[]>` — [bank-deposit.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts#L32) (L32–36)
- **Propósito / descripción:** "Últimas transacciones" de Transaccionar — las 10 más recientes, ya ordenadas (más reciente primero) y limitadas por el backend; nunca el historial completo. Cualquier cuenta autenticada, igual que la pantalla.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/recent'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositService.getOperationById`

- **Firma:** `getOperationById(id: string): Observable<BankDepositOperation>` — [bank-deposit.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts#L38) (L38–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<BankDepositOperation>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [bank-deposit-detail-modal.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-components-bank-deposit-detail-modal-bank-deposit-detail-modal-component-ts)

##### `BankDepositService.voidOperation`

- **Firma:** `voidOperation(id: string, reason: string): Observable<BankDepositOperation>` — [bank-deposit.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts#L45) (L45–49)
- **Propósito / descripción:** Admin-only on the backend (`@Roles`) — never a real delete/edit, marks the operation `isVoided` and keeps it forever for audit.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/void'`
- **Consumidores:** [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts)

##### `BankDepositService.getMonthlyCount`

- **Firma:** `getMonthlyCount(): Observable<BankDepositMonthlyCount>` — [bank-deposit.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts#L52) (L52–56)
- **Propósito / descripción:** Open to any authenticated account (unlike the full Reportería summary) — backs the Resumen dashboard's "Bancos" tile. Resets automatically every month: always the count for whatever month it is right now, never a stored/accumulating figure.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/monthly-count'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankDepositService.getTransactionSummary`

- **Firma:** `getTransactionSummary(): Observable<BankDepositTransactionSummary>` — [bank-deposit.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts#L59) (L59–63)
- **Propósito / descripción:** Open to any authenticated account, same policy as `getMonthlyCount()` — backs Transaccionar's own summary cards and the Resumen dashboard's daily section, both reading this exact same call so there is only one place "cuántas transacciones hoy/este mes" is computed.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/summary'`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankDepositService.getDailyStats`

- **Firma:** `getDailyStats(): Observable<BankDepositDailyStats>` — [bank-deposit.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts#L66) (L66–70)
- **Propósito / descripción:** Open to any authenticated account — backs the "Transacciones del mes" chart on both Resumen and Reporte de Transacciones, always the server's current calendar month.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<BankDepositDailyStats>>('${BASE_URL}/daily-stats').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/daily-stats'`
- **Consumidores:** [daily-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-daily-transactions-chart-daily-transactions-chart-component-ts), [transaction-monthly-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-transaction-monthly-chart-transaction-monthly-chart-component-ts)

##### `BankDepositService.getWeeklyStats`

- **Firma:** `getWeeklyStats(): Observable<BankDepositWeeklyStats>` — [bank-deposit.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts#L73) (L73–77)
- **Propósito / descripción:** Open to any authenticated account — backs "Transacciones por semana" en Gráficas → Indicadores de Transacciones, siempre el mes actual del servidor.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/weekly-stats'`
- **Consumidores:** [weekly-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-weekly-transactions-chart-weekly-transactions-chart-component-ts)

##### `BankDepositService.getYearlyStats`

- **Firma:** `getYearlyStats(): Observable<BankDepositYearlyStats>` — [bank-deposit.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts#L80) (L80–84)
- **Propósito / descripción:** Open to any authenticated account — backs "Transacciones por mes" (anual) en Gráficas → Indicadores de Transacciones, enero hasta el mes actual del año en curso.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/yearly-stats'`
- **Consumidores:** [yearly-transactions-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-yearly-transactions-chart-yearly-transactions-chart-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-bank-transfer-service-ts"></a>

### bank-transfer.service.ts

- **Ruta:** [bank-transfer.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts) (`comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts`, 73 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Finanzas → Transferencias Bancarias.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts), [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts)

#### Clase `BankTransferService` (L18–72)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Finanzas → Transferencias Bancarias. Toda regla (saldo suficiente, BI Club/Districol, límites) la valida el backend bajo lock.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `registerTransfer` | método public | 22–24 | `input: BankTransferInput` | `Observable<BankTransfer>` |
| `getTransfers` | método public | 26–34 | `filters?: { startDate?: string; endDate?: string; bankId?: string; limit?: number }` | `Observable<BankTransfer[]>` |
| `voidTransfer` | método public | 37–41 | `id: string`, `reason: string` | `Observable<BankTransfer>` |
| `registerBalanceCredit` | método public | 48–52 | `input: BankBalanceCreditInput` | `Observable<BankMovement>` |
| `getBalanceCredits` | método public | 54–64 | `filters?: { bankId?: string; page?: number; limit?: number }` | `Observable<PaginatedBankMovements>` |
| `voidBalanceCredit` | método public | 67–71 | `operationId: string`, `reason: string` | `Observable<BankMovement>` |

##### `BankTransferService.registerTransfer`

- **Firma:** `registerTransfer(input: BankTransferInput): Observable<BankTransfer>` — [bank-transfer.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts#L22) (L22–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<BankTransfer>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts)

##### `BankTransferService.getTransfers`

- **Firma:** `getTransfers(filters?: { startDate?: string; endDate?: string; bankId?: string; limit?: number }): Observable<BankTransfer[]>` — [bank-transfer.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts#L26) (L26–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams`, `Object.entries`, `params.set`, `String`, `this.http.get<ApiSuccessResponse<BankTransfer[]>>(BASE_URL, { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts)

##### `BankTransferService.voidTransfer`

- **Firma:** `voidTransfer(id: string, reason: string): Observable<BankTransfer>` — [bank-transfer.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts#L37) (L37–41)
- **Propósito / descripción:** Solo admin — genera los movimientos inversos; la transferencia original queda en el historial como ANULADA.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/void'`
- **Consumidores:** [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts)

##### `BankTransferService.registerBalanceCredit`

- **Firma:** `registerBalanceCredit(input: BankBalanceCreditInput): Observable<BankMovement>` — [bank-transfer.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts#L48) (L48–52)
- **Propósito / descripción:** "Acreditar saldo" (solo admin/super_admin; el backend lo exige). Suma el monto al saldo de la cuenta sin contrapartida y devuelve el movimiento ACREDITACION_SALDO con saldo anterior/posterior calculados por el backend.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/balance-credits'`
- **Consumidores:** [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts)

##### `BankTransferService.getBalanceCredits`

- **Firma:** `getBalanceCredits(filters?: { bankId?: string; page?: number; limit?: number }): Observable<PaginatedBankMovements>` — [bank-transfer.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts#L54) (L54–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams`, `Object.entries`, `params.set`, `String`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/balance-credits'`
- **Consumidores:** [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts)

##### `BankTransferService.voidBalanceCredit`

- **Firma:** `voidBalanceCredit(operationId: string, reason: string): Observable<BankMovement>` — [bank-transfer.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts#L67) (L67–71)
- **Propósito / descripción:** Solo admin — `operationId` es el `referenceId` del movimiento. Genera el movimiento inverso; la acreditación queda ANULADA en el historial.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/balance-credits/${operationId}/void'`
- **Consumidores:** [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-bank-service-ts"></a>

### bank.service.ts

- **Ruta:** [bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank.service.ts) (`comercial-jhoel-app/src/app/core/services/bank.service.ts`, 65 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `BankService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts), [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts), [banks-page.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts), [bank-form-modal.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-form-modal-bank-form-modal-component-ts), [bank-movements-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts), [transaccionar-page.component.spec.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-spec-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [bank-balance-strip.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts)

#### Clase `BankService` (L17–64)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getBanks` | método public | 21–25 | `includeInactive?`, `search?: string` | `Observable<Bank[]>` |
| `getBalanceStrip` | método public | 28–32 | — | `Observable<BankBalanceStripItem[]>` |
| `getBankById` | método public | 34–36 | `id: string` | `Observable<Bank>` |
| `createBank` | método public | 38–40 | `input: BankInput` | `Observable<Bank>` |
| `updateBank` | método public | 42–44 | `id: string`, `input: BankInput` | `Observable<Bank>` |
| `setAvailableInTransaccionar` | método public | 47–51 | `id: string`, `availableInTransaccionar: boolean` | `Observable<Bank>` |
| `adjustBalance` | método public | 54–58 | `id: string`, `input: BankBalanceAdjustmentInput` | `Observable<BankMovement>` |
| `deleteBank` | método public | 61–63 | `id: string` | `Observable<void>` |

##### `BankService.getBanks`

- **Firma:** `getBanks(includeInactive?, search?: string): Observable<Bank[]>` — [bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank.service.ts#L21) (L21–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `BankService.getBalanceStrip`

- **Firma:** `getBalanceStrip(): Observable<BankBalanceStripItem[]>` — [bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank.service.ts#L28) (L28–32)
- **Propósito / descripción:** Tira de saldos: cuentas principales con su saldo actual y la tendencia de hoy (calculada en el backend).
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/balance-strip'`
- **Consumidores:** [bank-balance-strip.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts)

##### `BankService.getBankById`

- **Firma:** `getBankById(id: string): Observable<Bank>` — [bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank.service.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Bank>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts)

##### `BankService.createBank`

- **Firma:** `createBank(input: BankInput): Observable<Bank>` — [bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank.service.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Bank>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [bank-form-modal.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-form-modal-bank-form-modal-component-ts)

##### `BankService.updateBank`

- **Firma:** `updateBank(id: string, input: BankInput): Observable<Bank>` — [bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank.service.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<Bank>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [bank-form-modal.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-form-modal-bank-form-modal-component-ts)

##### `BankService.setAvailableInTransaccionar`

- **Firma:** `setAvailableInTransaccionar(id: string, availableInTransaccionar: boolean): Observable<Bank>` — [bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank.service.ts#L47) (L47–51)
- **Propósito / descripción:** Muestra u oculta la cuenta en el selector "Cuenta bancaria afectada" de Transaccionar (solo admin).
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [banks-page.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts)

##### `BankService.adjustBalance`

- **Firma:** `adjustBalance(id: string, input: BankBalanceAdjustmentInput): Observable<BankMovement>` — [bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank.service.ts#L54) (L54–58)
- **Propósito / descripción:** "Ajustar saldo" — solo admin/super_admin (el backend lo exige). Queda como movimiento AJUSTE_MANUAL auditado; nunca sobrescribe el historial.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/balance-adjustments'`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts)

##### `BankService.deleteBank`

- **Firma:** `deleteBank(id: string): Observable<void>` — [bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/bank.service.ts#L61) (L61–63)
- **Propósito / descripción:** Soft delete — the backend deactivates the bank, it never deletes the row (past bank_balances history stays intact).
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [banks-page.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-business-service-ts"></a>

### business.service.ts

- **Ruta:** [business.service.ts](../../../../comercial-jhoel-app/src/app/core/services/business.service.ts) (`comercial-jhoel-app/src/app/core/services/business.service.ts`, 40 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `BusinessService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [businesses-page.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts), [business-form-modal.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-form-modal-business-form-modal-component-ts), [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts), [sales-register-page.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-sales-register-page-component-ts)

#### Clase `BusinessService` (L10–39)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getBusinesses` | método public | 15–19 | `includeInactive?` | `Observable<Business[]>` |
| `getBusinessById` | método public | 21–23 | `id: string` | `Observable<Business>` |
| `createBusiness` | método public | 25–27 | `input: BusinessInput` | `Observable<Business>` |
| `updateBusiness` | método public | 29–33 | `id: string`, `input: BusinessInput` | `Observable<Business>` |
| `deleteBusiness` | método public | 36–38 | `id: string` | `Observable<void>` |

##### `BusinessService.getBusinesses`

- **Firma:** `getBusinesses(includeInactive?): Observable<Business[]>` — [business.service.ts](../../../../comercial-jhoel-app/src/app/core/services/business.service.ts#L15) (L15–19)
- **Propósito / descripción:** Active-only by default — what the product form's dropdown should offer.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [businesses-page.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts)

##### `BusinessService.getBusinessById`

- **Firma:** `getBusinessById(id: string): Observable<Business>` — [business.service.ts](../../../../comercial-jhoel-app/src/app/core/services/business.service.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Business>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BusinessService.createBusiness`

- **Firma:** `createBusiness(input: BusinessInput): Observable<Business>` — [business.service.ts](../../../../comercial-jhoel-app/src/app/core/services/business.service.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Business>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [business-form-modal.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-form-modal-business-form-modal-component-ts)

##### `BusinessService.updateBusiness`

- **Firma:** `updateBusiness(id: string, input: BusinessInput): Observable<Business>` — [business.service.ts](../../../../comercial-jhoel-app/src/app/core/services/business.service.ts#L29) (L29–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<Business>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [business-form-modal.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-form-modal-business-form-modal-component-ts)

##### `BusinessService.deleteBusiness`

- **Firma:** `deleteBusiness(id: string): Observable<void>` — [business.service.ts](../../../../comercial-jhoel-app/src/app/core/services/business.service.ts#L36) (L36–38)
- **Propósito / descripción:** Soft delete — the backend deactivates the business, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [businesses-page.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-cash-control-sync-service-ts"></a>

### cash-control-sync.service.ts

- **Ruta:** [cash-control-sync.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control-sync.service.ts) (`comercial-jhoel-app/src/app/core/services/cash-control-sync.service.ts`, 86 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** "El efectivo físico cambió" — the real-time update mechanism of Control de Efectivo.
- **Depende de (archivos del proyecto):** [cash-control.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [cash-mutation.interceptor.spec.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-spec-ts), [cash-mutation.interceptor.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-ts), [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

**Constantes exportadas:**

- `CASH_POLL_INTERVAL_MS` (L9): Default polling period for changes made by OTHER users/devices. = `15_000`

#### Clase `CashControlSyncService` (L24–45)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** "El efectivo físico cambió" — the real-time update mechanism of Control de Efectivo. It never stores or computes a balance: it only tells subscribers to re-read the backend's official Kardex. Three sources, same pattern as `GuayacanCashSyncService` plus polling: - same tab: `notifyChanged()` (called by `cashMutationInterceptor` after any successful write that can move cash); - other tabs/windows of this browser: `BroadcastChannel`; - other users/devices: `onCashChanged()` polls the lightweight `GET /cash-control/balance` and fires only when the Kardex's last sequence changed (no WebSocket exists in this app's architecture).

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `notifyChanged` | método public | 41–44 | — | `void` |

##### `CashControlSyncService.notifyChanged`

- **Firma:** `notifyChanged(): void` — [cash-control-sync.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control-sync.service.ts#L41) (L41–44)
- **Propósito / descripción:** Call after the backend confirmed a write that may move physical cash.
- **Dependencias (llamadas en su cuerpo):** `this.local.next`, `this.channel?.postMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cash-mutation.interceptor.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

#### Función `onCashChanged` (L52–85)

- **Tipo:** función exportada
- **Firma:** `onCashChanged(callback: () => void, pollMs?: number): void` — [cash-control-sync.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control-sync.service.ts#L52)
- **Propósito / descripción:** Subscribes `callback` to cash changes (local writes, other tabs and — via polling while the tab is visible — other users). Cleans up with the component. Must be called from an injection context.
- **Dependencias:** `inject`, `sync.changed$.subscribe`, `callback`, `setInterval`, `service.getBalance().pipe(catchError(() => of(null))).subscribe`, `service.getBalance().pipe`, `service.getBalance`, `catchError`, `of`, `inject(DestroyRef).onDestroy`, `subscription.unsubscribe`, `clearInterval`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-services-cash-control-service-ts"></a>

### cash-control.service.ts

- **Ruta:** [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts) (`comercial-jhoel-app/src/app/core/services/cash-control.service.ts`, 153 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Finance → Control de Efectivo API client.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [cash-control-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-sync-service-ts), [settlement-modal.component.spec.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-spec-ts), [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts), [cash-control-page.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-spec-ts), [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-bank-deposit-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-spec-ts), [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts), [cash-counts-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-counts-panel-cash-counts-panel-component-ts), [cash-movement-form-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-movement-form-modal-cash-movement-form-modal-component-ts), [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts), [cut-detail-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-detail-modal-cut-detail-modal-component-ts), [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts), [cut-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts), [warehouse-withdrawal-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-spec-ts), [warehouse-withdrawal-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts) y 2 más

#### Clase `CashControlService` (L42–152)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Finance → Control de Efectivo API client. The backend's Kardex is the ONLY source of the cash balance: every write returns the official state (position or movement + balance) and this layer never recalculates it.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getPosition` | método public | 47–49 | — | `Observable<CashPosition>` |
| `getBankDays` | método public | 52–56 | `limit?` | `Observable<CashBankDaySummary[]>` |
| `getBankDay` | método public | 59–61 | `date: string` | `Observable<CashBankDaySummary>` |
| `getBalance` | método public | 64–66 | — | `Observable<CashBalanceSnapshot>` |
| `getMovements` | método public | 68–72 | `filters: CashMovementFilters` | `Observable<PaginatedCashMovements>` |
| `getRecentMovements` | método public | 75–79 | `limit?` | `Observable<CashMovement[]>` |
| `getUsers` | método public | 81–83 | — | `Observable<{ id: string; username: string }[]>` |
| `getBankBalances` | método public | 85–87 | — | `Observable<CashBankBalance[]>` |
| `registerMovement` | método public | 89–91 | `input: RegisterCashMovementInput` | `Observable<CashMovementResult>` |
| `getMovement` | método public | 94–96 | `id: string` | `Observable<CashMovement>` |
| `registerBankDeposit` | método public | 99–103 | `input: RegisterCashBankDepositInput` | `Observable<CashMovementResult>` |
| `voidMovement` | método public | 105–109 | `id: string`, `reason: string` | `Observable<CashMovementResult>` |
| `openDay` | método public | 111–113 | `input: OpenCashDayInput` | `Observable<CashPosition>` |
| `closeDay` | método public | 115–119 | `dayId: string`, `observations?: string` | `Observable<CashPosition>` |
| `updateSchedule` | método public | 121–125 | `periodId: string`, `start: string`, `end: string`, `reason: string` | `Observable<CashPosition>` |
| `startCut` | método public | 127–129 | `periodId: string` | `Observable<CashPosition>` |
| `finishCut` | método public | 131–135 | `periodId: string`, `input: FinishCashCutInput` | `Observable<CashPosition>` |
| `reopenCut` | método public | 137–141 | `periodId: string`, `reason: string` | `Observable<CashPosition>` |
| `getDays` | método public | 143–147 | `filters: CashDayFilters` | `Observable<PaginatedCashDays>` |
| `getCutDetail` | método public | 149–151 | `periodId: string` | `Observable<CashCutDetail>` |

##### `CashControlService.getPosition`

- **Firma:** `getPosition(): Observable<CashPosition>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L47) (L47–49)
- **Propósito / descripción:** Main card, day state, cuts (with live totals) and today's summary in one call.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CashPosition>>('${BASE_URL}/position').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/position'`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts)

##### `CashControlService.getBankDays`

- **Firma:** `getBankDays(limit?): Observable<CashBankDaySummary[]>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L52) (L52–56)
- **Propósito / descripción:** Bank operational days (newest first) with their own daily indicators — the day selector/history.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/bank-days'`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts)

##### `CashControlService.getBankDay`

- **Firma:** `getBankDay(date: string): Observable<CashBankDaySummary>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L59) (L59–61)
- **Propósito / descripción:** Original indicators of one bank day (read only).
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/bank-days/${date}'`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts)

##### `CashControlService.getBalance`

- **Firma:** `getBalance(): Observable<CashBalanceSnapshot>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L64) (L64–66)
- **Propósito / descripción:** Lightweight balance + last sequence, used for change detection polling.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CashBalanceSnapshot>>('${BASE_URL}/balance').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/balance'`
- **Consumidores:** [cash-control-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cash-control-sync-service-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `CashControlService.getMovements`

- **Firma:** `getMovements(filters: CashMovementFilters): Observable<PaginatedCashMovements>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L68) (L68–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/movements'`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts)

##### `CashControlService.getRecentMovements`

- **Firma:** `getRecentMovements(limit?): Observable<CashMovement[]>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L75) (L75–79)
- **Propósito / descripción:** Last N movements (default 10), newest first — Transaccionar's "Últimas transacciones".
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/movements/recent'`
- **Consumidores:** [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `CashControlService.getUsers`

- **Firma:** `getUsers(): Observable<{ id: string; username: string }[]>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/users'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashControlService.getBankBalances`

- **Firma:** `getBankBalances(): Observable<CashBankBalance[]>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L85) (L85–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CashBankBalance[]>>('${BASE_URL}/bank-balances').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/bank-balances'`
- **Consumidores:** [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts), [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts), [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts), [warehouse-withdrawal-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts)

##### `CashControlService.registerMovement`

- **Firma:** `registerMovement(input: RegisterCashMovementInput): Observable<CashMovementResult>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/movements'`
- **Consumidores:** [cash-movement-form-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-movement-form-modal-cash-movement-form-modal-component-ts)

##### `CashControlService.getMovement`

- **Firma:** `getMovement(id: string): Observable<CashMovement>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L94) (L94–96)
- **Propósito / descripción:** One movement with its denomination breakdown (if any).
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CashMovement>>('${BASE_URL}/movements/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/movements/${id}'`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts)

##### `CashControlService.registerBankDeposit`

- **Firma:** `registerBankDeposit(input: RegisterCashBankDepositInput): Observable<CashMovementResult>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L99) (L99–103)
- **Propósito / descripción:** "Depósito bancario": cash leaves the caja and the selected account increases — one backend transaction.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/bank-deposits'`
- **Consumidores:** [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts)

##### `CashControlService.voidMovement`

- **Firma:** `voidMovement(id: string, reason: string): Observable<CashMovementResult>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L105) (L105–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/movements/${id}/void'`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts)

##### `CashControlService.openDay`

- **Firma:** `openDay(input: OpenCashDayInput): Observable<CashPosition>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L111) (L111–113)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<CashPosition>>('${BASE_URL}/days/open', input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/days/open'`
- **Consumidores:** [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts)

##### `CashControlService.closeDay`

- **Firma:** `closeDay(dayId: string, observations?: string): Observable<CashPosition>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L115) (L115–119)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/days/${dayId}/close'`
- **Consumidores:** [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts)

##### `CashControlService.updateSchedule`

- **Firma:** `updateSchedule(periodId: string, start: string, end: string, reason: string): Observable<CashPosition>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L121) (L121–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/cuts/${periodId}/schedule'`
- **Consumidores:** [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts)

##### `CashControlService.startCut`

- **Firma:** `startCut(periodId: string): Observable<CashPosition>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L127) (L127–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/cuts/${periodId}/start'`
- **Consumidores:** [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts)

##### `CashControlService.finishCut`

- **Firma:** `finishCut(periodId: string, input: FinishCashCutInput): Observable<CashPosition>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L131) (L131–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/cuts/${periodId}/finish'`
- **Consumidores:** [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts)

##### `CashControlService.reopenCut`

- **Firma:** `reopenCut(periodId: string, reason: string): Observable<CashPosition>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L137) (L137–141)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/cuts/${periodId}/reopen'`
- **Consumidores:** [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts)

##### `CashControlService.getDays`

- **Firma:** `getDays(filters: CashDayFilters): Observable<PaginatedCashDays>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L143) (L143–147)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/days'`
- **Consumidores:** [cut-history.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-history-cut-history-component-ts)

##### `CashControlService.getCutDetail`

- **Firma:** `getCutDetail(periodId: string): Observable<CashCutDetail>` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L149) (L149–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CashCutDetail>>('${BASE_URL}/cuts/${periodId}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/cuts/${periodId}'`
- **Consumidores:** [cut-detail-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-detail-modal-cut-detail-modal-component-ts)

#### Función `toParams` (L27–35)

- **Tipo:** función local del archivo
- **Firma:** `toParams(filters: object): HttpParams` — [cash-control.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts#L27)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new HttpParams`, `Object.entries`, `params.set`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-cash-custody-service-ts"></a>

### cash-custody.service.ts

- **Ruta:** [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts) (`comercial-jhoel-app/src/app/core/services/cash-custody.service.ts`, 131 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** API client of "Arqueo de Caja" and "Bodega".
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [cuadre-agentes-page.component.spec.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-spec-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts), [cash-count-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-spec-ts), [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts), [cash-counts-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-counts-panel-cash-counts-panel-component-ts), [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts), [warehouse-transfer-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-spec-ts), [warehouse-transfer-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-ts), [warehouse-withdrawal-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-spec-ts), [warehouse-withdrawal-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts)

#### Clase `CashCustodyService` (L38–130)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** API client of "Arqueo de Caja" and "Bodega". Every write under `/cash-control` is broadcast by `cashMutationInterceptor`, so all open views re-read the official balances (same real-time channel as the rest).
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getCustody` | método public | 43–45 | — | `Observable<CashCustody>` |
| `getCounts` | método public | 47–51 | `filters: CashCountFilters` | `Observable<PaginatedResult<CashCountRecord>>` |
| `getLatestCount` | método public | 57–63 | `businessDate?: string` | `Observable<LatestCashCountResponse>` |
| `getCount` | método public | 65–67 | `id: string` | `Observable<CashCountRecord>` |
| `registerCount` | método public | 70–72 | `input: RegisterCashCountInput` | `Observable<CashCountRecord>` |
| `correctCount` | método public | 75–79 | `id: string`, `input: RegisterCashCountInput & { reason: string }` | `Observable<CashCountRecord>` |
| `getTransfers` | método public | 81–85 | `filters: { dateFrom?: string; dateTo?: string; status?: string; page?: number; limit?: number }` | `Observable<PaginatedResult<WarehouseTransfer>>` |
| `registerTransfer` | método public | 88–92 | `input: RegisterWarehouseTransferInput` | `Observable<{ transfer: WarehouseTransfer; custody: CashCustody }>` |
| `voidTransfer` | método public | 94–98 | `id: string`, `reason: string` | `Observable<{ transfer: WarehouseTransfer; custody: CashCustody }>` |
| `getWithdrawals` | método public | 100–104 | `filters: { dateFrom?: string; dateTo?: string; status?: string; page?: number; limit?: number }` | `Observable<PaginatedResult<WarehouseWithdrawal>>` |
| `registerWithdrawal` | método public | 107–111 | `input: RegisterWarehouseWithdrawalInput` | `Observable<{ withdrawal: WarehouseWithdrawal; custody: CashCustody }>` |
| `voidWithdrawal` | método public | 113–117 | `id: string`, `reason: string` | `Observable<{ withdrawal: WarehouseWithdrawal; custody: CashCustody }>` |
| `getWarehouseMovements` | método public | 119–123 | `page?`, `limit?` | `Observable<PaginatedResult<WarehouseMovement>>` |
| `registerWarehouseInitialBalance` | método public | 125–129 | `amount: number`, `reason: string`, `clientRequestId: string` | `Observable<CashCustody>` |

##### `CashCustodyService.getCustody`

- **Firma:** `getCustody(): Observable<CashCustody>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L43) (L43–45)
- **Propósito / descripción:** Caja, Bodega and total under custody.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CashCustody>>('${BASE_URL}/custody').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/custody'`
- **Consumidores:** [cash-control-page.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts)

##### `CashCustodyService.getCounts`

- **Firma:** `getCounts(filters: CashCountFilters): Observable<PaginatedResult<CashCountRecord>>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L47) (L47–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/counts'`
- **Consumidores:** [cash-counts-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-counts-panel-cash-counts-panel-component-ts)

##### `CashCustodyService.getLatestCount`

- **Firma:** `getLatestCount(businessDate?: string): Observable<LatestCashCountResponse>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L57) (L57–63)
- **Propósito / descripción:** Latest valid Arqueo de Caja (all 12 denominations, missing ones as 0) for Cuadre de Agentes; a count of `businessDate` is preferred. Read-only.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/counts/latest'`
- **Consumidores:** [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

##### `CashCustodyService.getCount`

- **Firma:** `getCount(id: string): Observable<CashCountRecord>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CashCountRecord>>('${BASE_URL}/counts/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/counts/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CashCustodyService.registerCount`

- **Firma:** `registerCount(input: RegisterCashCountInput): Observable<CashCountRecord>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L70) (L70–72)
- **Propósito / descripción:** Saves a count (photograph only — it never adjusts the caja).
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<CashCountRecord>>('${BASE_URL}/counts', input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/counts'`
- **Consumidores:** [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts)

##### `CashCustodyService.correctCount`

- **Firma:** `correctCount(id: string, input: RegisterCashCountInput & { reason: string }): Observable<CashCountRecord>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L75) (L75–79)
- **Propósito / descripción:** Audited correction of a count (admin): the original stays, marked as replaced.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/counts/${id}/corrections'`
- **Consumidores:** [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts)

##### `CashCustodyService.getTransfers`

- **Firma:** `getTransfers(filters: { dateFrom?: string; dateTo?: string; status?: string; page?: number; limit?: number }): Observable<PaginatedResult<WarehouseTransfer>>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L81) (L81–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/warehouse/transfers'`
- **Consumidores:** [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts)

##### `CashCustodyService.registerTransfer`

- **Firma:** `registerTransfer(input: RegisterWarehouseTransferInput): Observable<{ transfer: WarehouseTransfer; custody: CashCustody }>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L88) (L88–92)
- **Propósito / descripción:** Internal transfer caja → Bodega (both Kardex in one transaction).
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/warehouse/transfers'`
- **Consumidores:** [warehouse-transfer-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-ts)

##### `CashCustodyService.voidTransfer`

- **Firma:** `voidTransfer(id: string, reason: string): Observable<{ transfer: WarehouseTransfer; custody: CashCustody }>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L94) (L94–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/warehouse/transfers/${id}/void'`
- **Consumidores:** [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts)

##### `CashCustodyService.getWithdrawals`

- **Firma:** `getWithdrawals(filters: { dateFrom?: string; dateTo?: string; status?: string; page?: number; limit?: number }): Observable<PaginatedResult<WarehouseWithdrawal>>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L100) (L100–104)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/warehouse/withdrawals'`
- **Consumidores:** [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts)

##### `CashCustodyService.registerWithdrawal`

- **Firma:** `registerWithdrawal(input: RegisterWarehouseWithdrawalInput): Observable<{ withdrawal: WarehouseWithdrawal; custody: CashCustody }>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L107) (L107–111)
- **Propósito / descripción:** Cash out of Bodega: back to the caja or deposited into a bank account (one transaction in the backend).
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/warehouse/withdrawals'`
- **Consumidores:** [warehouse-withdrawal-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-withdrawal-modal-warehouse-withdrawal-modal-component-ts)

##### `CashCustodyService.voidWithdrawal`

- **Firma:** `voidWithdrawal(id: string, reason: string): Observable<{ withdrawal: WarehouseWithdrawal; custody: CashCustody }>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L113) (L113–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/warehouse/withdrawals/${id}/void'`
- **Consumidores:** [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts)

##### `CashCustodyService.getWarehouseMovements`

- **Firma:** `getWarehouseMovements(page?, limit?): Observable<PaginatedResult<WarehouseMovement>>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L119) (L119–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/warehouse/movements'`
- **Consumidores:** [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts)

##### `CashCustodyService.registerWarehouseInitialBalance`

- **Firma:** `registerWarehouseInitialBalance(amount: number, reason: string, clientRequestId: string): Observable<CashCustody>` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L125) (L125–129)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/warehouse/initial-balance'`
- **Consumidores:** [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts)

#### Función `toParams` (L23–31)

- **Tipo:** función local del archivo
- **Firma:** `toParams(filters: object): HttpParams` — [cash-custody.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts#L23)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new HttpParams`, `Object.entries`, `params.set`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-catalog-bank-service-ts"></a>

### catalog-bank.service.ts

- **Ruta:** [catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts) (`comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts`, 64 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Admin "Sistema → Catálogo de Bancos" — CRUD + orden + imagen.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [catalog-banks-page.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts), [bank-form-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-form-modal-bank-form-modal-component-ts), [bank-image-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-image-modal-bank-image-modal-component-ts)

#### Clase `CatalogBankService` (L11–63)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Admin "Sistema → Catálogo de Bancos" — CRUD + orden + imagen. Todo el controller es admin-only en el backend.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getBanks` | método public | 15–21 | `includeInactive?`, `search?: string` | `Observable<CatalogBank[]>` |
| `getBankById` | método public | 23–25 | `id: string` | `Observable<CatalogBank>` |
| `createBank` | método public | 27–29 | `input: CreateCatalogBankInput` | `Observable<CatalogBank>` |
| `updateBank` | método public | 31–35 | `id: string`, `input: UpdateCatalogBankInput` | `Observable<CatalogBank>` |
| `activateBank` | método public | 37–39 | `id: string` | `Observable<void>` |
| `deactivateBank` | método public | 42–44 | `id: string` | `Observable<void>` |
| `reorderBanks` | método public | 46–48 | `items: { id: string; sortOrder: number }[]` | `Observable<void>` |
| `setImage` | método public | 50–54 | `catalogBankId: string`, `file: File` | `Observable<void>` |
| `removeImage` | método public | 56–58 | `catalogBankId: string` | `Observable<void>` |
| `getImageUrl` | método public | 60–62 | `catalogBankId: string` | `string` |

##### `CatalogBankService.getBanks`

- **Firma:** `getBanks(includeInactive?, search?: string): Observable<CatalogBank[]>` — [catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts#L15) (L15–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [catalog-banks-page.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts)

##### `CatalogBankService.getBankById`

- **Firma:** `getBankById(id: string): Observable<CatalogBank>` — [catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts#L23) (L23–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CatalogBank>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [bank-image-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-image-modal-bank-image-modal-component-ts)

##### `CatalogBankService.createBank`

- **Firma:** `createBank(input: CreateCatalogBankInput): Observable<CatalogBank>` — [catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<CatalogBank>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [bank-form-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-form-modal-bank-form-modal-component-ts)

##### `CatalogBankService.updateBank`

- **Firma:** `updateBank(id: string, input: UpdateCatalogBankInput): Observable<CatalogBank>` — [catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts#L31) (L31–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<CatalogBank>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [bank-form-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-form-modal-bank-form-modal-component-ts)

##### `CatalogBankService.activateBank`

- **Firma:** `activateBank(id: string): Observable<void>` — [catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/activate'`
- **Consumidores:** [catalog-banks-page.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts)

##### `CatalogBankService.deactivateBank`

- **Firma:** `deactivateBank(id: string): Observable<void>` — [catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts#L42) (L42–44)
- **Propósito / descripción:** Soft delete — el backend desactiva, nunca borra la fila (histórico preservado).
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [catalog-banks-page.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts)

##### `CatalogBankService.reorderBanks`

- **Firma:** `reorderBanks(items: { id: string; sortOrder: number }[]): Observable<void>` — [catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/reorder'`
- **Consumidores:** [catalog-banks-page.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts)

##### `CatalogBankService.setImage`

- **Firma:** `setImage(catalogBankId: string, file: File): Observable<void>` — [catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts#L50) (L50–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new FormData`, `formData.set`, `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${catalogBankId}/image'`
- **Consumidores:** [bank-image-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-image-modal-bank-image-modal-component-ts)

##### `CatalogBankService.removeImage`

- **Firma:** `removeImage(catalogBankId: string): Observable<void>` — [catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${catalogBankId}/image'`
- **Consumidores:** [bank-image-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-image-modal-bank-image-modal-component-ts)

##### `CatalogBankService.getImageUrl`

- **Firma:** `getImageUrl(catalogBankId: string): string` — [catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-image-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-image-modal-bank-image-modal-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-catalog-phone-service-ts"></a>

### catalog-phone.service.ts

- **Ruta:** [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts) (`comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts`, 78 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Admin "Catálogo → Teléfonos" — gestión completa (CRUD + publicar/despublicar + orden + imágenes).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [catalog-phones-page.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts), [catalog-phone-form-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-form-modal-catalog-phone-form-modal-component-ts), [catalog-phone-images-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-images-modal-catalog-phone-images-modal-component-ts)

#### Clase `CatalogPhoneService` (L11–77)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Admin "Catálogo → Teléfonos" — gestión completa (CRUD + publicar/despublicar + orden + imágenes). Todo el controller es admin-only en el backend.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getPhones` | método public | 15–19 | `includeInactive?`, `search?: string` | `Observable<CatalogPhone[]>` |
| `getPhoneById` | método public | 21–23 | `id: string` | `Observable<CatalogPhone>` |
| `createPhone` | método public | 25–27 | `input: CatalogPhoneInput` | `Observable<CatalogPhone>` |
| `updatePhone` | método public | 29–33 | `id: string`, `input: CatalogPhoneInput` | `Observable<CatalogPhone>` |
| `activatePhone` | método public | 35–37 | `id: string` | `Observable<void>` |
| `deactivatePhone` | método public | 40–42 | `id: string` | `Observable<void>` |
| `publishPhone` | método public | 44–46 | `id: string` | `Observable<void>` |
| `unpublishPhone` | método public | 48–50 | `id: string` | `Observable<void>` |
| `reorderPhones` | método public | 52–54 | `items: { id: string; sortOrder: number }[]` | `Observable<void>` |
| `addImage` | método public | 57–63 | `catalogPhoneId: string`, `file: File` | `Observable<CatalogPhoneImage>` |
| `removeImage` | método public | 65–67 | `catalogPhoneId: string`, `imageId: string` | `Observable<void>` |
| `setPrimaryImage` | método public | 69–71 | `catalogPhoneId: string`, `imageId: string` | `Observable<void>` |
| `getImageUrl` | método public | 74–76 | `imageId: string` | `string` |

##### `CatalogPhoneService.getPhones`

- **Firma:** `getPhones(includeInactive?, search?: string): Observable<CatalogPhone[]>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L15) (L15–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [catalog-phones-page.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts)

##### `CatalogPhoneService.getPhoneById`

- **Firma:** `getPhoneById(id: string): Observable<CatalogPhone>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CatalogPhone>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [catalog-phone-images-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-images-modal-catalog-phone-images-modal-component-ts)

##### `CatalogPhoneService.createPhone`

- **Firma:** `createPhone(input: CatalogPhoneInput): Observable<CatalogPhone>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<CatalogPhone>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [catalog-phone-form-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-form-modal-catalog-phone-form-modal-component-ts)

##### `CatalogPhoneService.updatePhone`

- **Firma:** `updatePhone(id: string, input: CatalogPhoneInput): Observable<CatalogPhone>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L29) (L29–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<CatalogPhone>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [catalog-phone-form-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-form-modal-catalog-phone-form-modal-component-ts)

##### `CatalogPhoneService.activatePhone`

- **Firma:** `activatePhone(id: string): Observable<void>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/activate'`
- **Consumidores:** [catalog-phones-page.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts)

##### `CatalogPhoneService.deactivatePhone`

- **Firma:** `deactivatePhone(id: string): Observable<void>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L40) (L40–42)
- **Propósito / descripción:** Soft delete — el backend desactiva y despublica el teléfono, nunca borra la fila.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [catalog-phones-page.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts)

##### `CatalogPhoneService.publishPhone`

- **Firma:** `publishPhone(id: string): Observable<void>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/publish'`
- **Consumidores:** [catalog-phones-page.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts)

##### `CatalogPhoneService.unpublishPhone`

- **Firma:** `unpublishPhone(id: string): Observable<void>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/unpublish'`
- **Consumidores:** [catalog-phones-page.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts)

##### `CatalogPhoneService.reorderPhones`

- **Firma:** `reorderPhones(items: { id: string; sortOrder: number }[]): Observable<void>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/reorder'`
- **Consumidores:** [catalog-phones-page.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts)

##### `CatalogPhoneService.addImage`

- **Firma:** `addImage(catalogPhoneId: string, file: File): Observable<CatalogPhoneImage>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L57) (L57–63)
- **Propósito / descripción:** `FormData` multipart — nunca fijar manualmente el header Content-Type, Angular/el navegador arman el boundary.
- **Dependencias (llamadas en su cuerpo):** `new FormData`, `formData.set`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${catalogPhoneId}/images'`
- **Consumidores:** [catalog-phone-images-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-images-modal-catalog-phone-images-modal-component-ts)

##### `CatalogPhoneService.removeImage`

- **Firma:** `removeImage(catalogPhoneId: string, imageId: string): Observable<void>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L65) (L65–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${catalogPhoneId}/images/${imageId}'`
- **Consumidores:** [catalog-phone-images-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-images-modal-catalog-phone-images-modal-component-ts)

##### `CatalogPhoneService.setPrimaryImage`

- **Firma:** `setPrimaryImage(catalogPhoneId: string, imageId: string): Observable<void>` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${catalogPhoneId}/images/${imageId}/primary'`
- **Consumidores:** [catalog-phone-images-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-images-modal-catalog-phone-images-modal-component-ts)

##### `CatalogPhoneService.getImageUrl`

- **Firma:** `getImageUrl(imageId: string): string` — [catalog-phone.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts#L74) (L74–76)
- **Propósito / descripción:** URL pública (sin auth) de una imagen del catálogo — servida vía streaming con cache agresivo de navegador. Ruta bajo `/public-catalog`, distinta de este servicio's propio `BASE_URL` admin-gated (ver `PublicCatalogController`).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-phone-images-modal.component.ts](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-images-modal-catalog-phone-images-modal-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-catalog-product-request-service-ts"></a>

### catalog-product-request.service.ts

- **Ruta:** [catalog-product-request.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product-request.service.ts) (`comercial-jhoel-app/src/app/core/services/catalog-product-request.service.ts`, 46 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Admin "Solicitudes de Variedades" — leads de "Lo quiero" capturados desde la landing pública.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [catalog-product-requests-page.component.ts](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-catalog-product-requests-page-component-ts), [catalog-product-request-detail-modal.component.ts](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-detail-modal-catalog-product-request-detail-modal-component-ts)

#### Clase `CatalogProductRequestService` (L16–45)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Admin "Solicitudes de Variedades" — leads de "Lo quiero" capturados desde la landing pública. Librería nunca genera filas aquí.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getRequests` | método public | 20–29 | `filters?: ListCatalogProductRequestsFilters` | `Observable<CatalogProductRequest[]>` |
| `getRequestById` | método public | 31–35 | `id: string` | `Observable<CatalogProductRequest>` |
| `updateStatus` | método public | 37–44 | `id: string`, `input: UpdateCatalogProductRequestStatusInput` | `Observable<CatalogProductRequest>` |

##### `CatalogProductRequestService.getRequests`

- **Firma:** `getRequests(filters?: ListCatalogProductRequestsFilters): Observable<CatalogProductRequest[]>` — [catalog-product-request.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product-request.service.ts#L20) (L20–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CatalogProductRequest[]>>(BASE_URL, { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [catalog-product-requests-page.component.ts](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-catalog-product-requests-page-component-ts)

##### `CatalogProductRequestService.getRequestById`

- **Firma:** `getRequestById(id: string): Observable<CatalogProductRequest>` — [catalog-product-request.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product-request.service.ts#L31) (L31–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CatalogProductRequest>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductRequestService.updateStatus`

- **Firma:** `updateStatus(id: string, input: UpdateCatalogProductRequestStatusInput): Observable<CatalogProductRequest>` — [catalog-product-request.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product-request.service.ts#L37) (L37–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}/status'`
- **Consumidores:** [catalog-product-request-detail-modal.component.ts](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-detail-modal-catalog-product-request-detail-modal-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-catalog-product-service-ts"></a>

### catalog-product.service.ts

- **Ruta:** [catalog-product.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts) (`comercial-jhoel-app/src/app/core/services/catalog-product.service.ts`, 80 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Admin "Catálogo → Librería"/"Variedades y Accesorios" — un solo servicio compartido, parametrizado por `section`.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [catalog-products-page.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts), [catalog-product-form-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-form-modal-catalog-product-form-modal-component-ts), [catalog-product-image-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-image-modal-catalog-product-image-modal-component-ts)

#### Clase `CatalogProductService` (L17–79)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Admin "Catálogo → Librería"/"Variedades y Accesorios" — un solo servicio compartido, parametrizado por `section`. Todo el controller es admin-only en el backend.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getProducts` | método public | 21–31 | `section: CatalogProductSection`, `includeInactive?`, `search?: string` | `Observable<CatalogProduct[]>` |
| `getProductById` | método public | 33–37 | `id: string` | `Observable<CatalogProduct>` |
| `createProduct` | método public | 39–43 | `input: CreateCatalogProductInput` | `Observable<CatalogProduct>` |
| `updateProduct` | método public | 45–49 | `id: string`, `input: UpdateCatalogProductInput` | `Observable<CatalogProduct>` |
| `activateProduct` | método public | 51–53 | `id: string` | `Observable<void>` |
| `deactivateProduct` | método public | 56–58 | `id: string` | `Observable<void>` |
| `reorderProducts` | método public | 60–62 | `items: { id: string; sortOrder: number }[]` | `Observable<void>` |
| `setImage` | método public | 65–69 | `catalogProductId: string`, `file: File` | `Observable<void>` |
| `removeImage` | método public | 71–73 | `catalogProductId: string` | `Observable<void>` |
| `getImageUrl` | método public | 76–78 | `catalogProductId: string` | `string` |

##### `CatalogProductService.getProducts`

- **Firma:** `getProducts(section: CatalogProductSection, includeInactive?, search?: string): Observable<CatalogProduct[]>` — [catalog-product.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts#L21) (L21–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [catalog-products-page.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts)

##### `CatalogProductService.getProductById`

- **Firma:** `getProductById(id: string): Observable<CatalogProduct>` — [catalog-product.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts#L33) (L33–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CatalogProduct>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [catalog-product-image-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-image-modal-catalog-product-image-modal-component-ts)

##### `CatalogProductService.createProduct`

- **Firma:** `createProduct(input: CreateCatalogProductInput): Observable<CatalogProduct>` — [catalog-product.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts#L39) (L39–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<CatalogProduct>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [catalog-product-form-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-form-modal-catalog-product-form-modal-component-ts)

##### `CatalogProductService.updateProduct`

- **Firma:** `updateProduct(id: string, input: UpdateCatalogProductInput): Observable<CatalogProduct>` — [catalog-product.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts#L45) (L45–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<CatalogProduct>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [catalog-product-form-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-form-modal-catalog-product-form-modal-component-ts)

##### `CatalogProductService.activateProduct`

- **Firma:** `activateProduct(id: string): Observable<void>` — [catalog-product.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/activate'`
- **Consumidores:** [catalog-products-page.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts)

##### `CatalogProductService.deactivateProduct`

- **Firma:** `deactivateProduct(id: string): Observable<void>` — [catalog-product.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts#L56) (L56–58)
- **Propósito / descripción:** Soft delete — el backend desactiva, nunca borra la fila.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [catalog-products-page.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts)

##### `CatalogProductService.reorderProducts`

- **Firma:** `reorderProducts(items: { id: string; sortOrder: number }[]): Observable<void>` — [catalog-product.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/reorder'`
- **Consumidores:** [catalog-products-page.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts)

##### `CatalogProductService.setImage`

- **Firma:** `setImage(catalogProductId: string, file: File): Observable<void>` — [catalog-product.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts#L65) (L65–69)
- **Propósito / descripción:** `FormData` multipart — nunca fijar manualmente el header Content-Type.
- **Dependencias (llamadas en su cuerpo):** `new FormData`, `formData.set`, `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${catalogProductId}/image'`
- **Consumidores:** [catalog-product-image-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-image-modal-catalog-product-image-modal-component-ts)

##### `CatalogProductService.removeImage`

- **Firma:** `removeImage(catalogProductId: string): Observable<void>` — [catalog-product.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${catalogProductId}/image'`
- **Consumidores:** [catalog-product-image-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-image-modal-catalog-product-image-modal-component-ts)

##### `CatalogProductService.getImageUrl`

- **Firma:** `getImageUrl(catalogProductId: string): string` — [catalog-product.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts#L76) (L76–78)
- **Propósito / descripción:** URL pública (sin auth), bajo `/public-catalog` — distinta del `BASE_URL` admin-gated de este servicio.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [catalog-product-image-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-image-modal-catalog-product-image-modal-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-catalog-request-service-ts"></a>

### catalog-request.service.ts

- **Ruta:** [catalog-request.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-request.service.ts) (`comercial-jhoel-app/src/app/core/services/catalog-request.service.ts`, 42 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Admin "Catálogo → Solicitudes" — leads de interés/crédito capturados desde la landing pública.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [catalog-requests-page.component.ts](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-catalog-requests-page-component-ts), [catalog-request-detail-modal.component.ts](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-detail-modal-catalog-request-detail-modal-component-ts)

#### Clase `CatalogRequestService` (L16–41)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Admin "Catálogo → Solicitudes" — leads de interés/crédito capturados desde la landing pública.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getRequests` | método public | 20–30 | `filters?: ListCatalogRequestsFilters` | `Observable<CatalogRequest[]>` |
| `getRequestById` | método public | 32–34 | `id: string` | `Observable<CatalogRequest>` |
| `updateStatus` | método public | 36–40 | `id: string`, `input: UpdateCatalogRequestStatusInput` | `Observable<CatalogRequest>` |

##### `CatalogRequestService.getRequests`

- **Firma:** `getRequests(filters?: ListCatalogRequestsFilters): Observable<CatalogRequest[]>` — [catalog-request.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-request.service.ts#L20) (L20–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CatalogRequest[]>>(BASE_URL, { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [catalog-requests-page.component.ts](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-catalog-requests-page-component-ts)

##### `CatalogRequestService.getRequestById`

- **Firma:** `getRequestById(id: string): Observable<CatalogRequest>` — [catalog-request.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-request.service.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CatalogRequest>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogRequestService.updateStatus`

- **Firma:** `updateStatus(id: string, input: UpdateCatalogRequestStatusInput): Observable<CatalogRequest>` — [catalog-request.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog-request.service.ts#L36) (L36–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}/status'`
- **Consumidores:** [catalog-request-detail-modal.component.ts](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-detail-modal-catalog-request-detail-modal-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-catalog-service-ts"></a>

### catalog.service.ts

- **Ruta:** [catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog.service.ts) (`comercial-jhoel-app/src/app/core/services/catalog.service.ts`, 20 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Product catalog categories shown on the landing preview and the full catalog page.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [catalog-page.component.ts](catalog.md#f-comercial-jhoel-app-src-app-features-catalog-catalog-page-component-ts), [catalog-preview.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-preview-catalog-preview-component-ts)

#### Clase `CatalogService` (L14–19)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Product catalog categories shown on the landing preview and the full catalog page. Phase 2: replace the `of(...)` body with `this.http.get&lt;CatalogCategory[]&gt;(\`${environment.apiUrl}/catalog/categories\`)`.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getCategories` | método public | 16–18 | — | `Observable<CatalogCategory[]>` |

##### `CatalogService.getCategories`

- **Firma:** `getCategories(): Observable<CatalogCategory[]>` — [catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/catalog.service.ts#L16) (L16–18)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `of`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-category-service-ts"></a>

### category.service.ts

- **Ruta:** [category.service.ts](../../../../comercial-jhoel-app/src/app/core/services/category.service.ts) (`comercial-jhoel-app/src/app/core/services/category.service.ts`, 40 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `CategoryService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [categories-page.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts), [category-form-modal.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-form-modal-category-form-modal-component-ts), [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts)

#### Clase `CategoryService` (L10–39)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getCategories` | método public | 15–19 | `includeInactive?` | `Observable<Category[]>` |
| `getCategoryById` | método public | 21–23 | `id: string` | `Observable<Category>` |
| `createCategory` | método public | 25–27 | `input: CategoryInput` | `Observable<Category>` |
| `updateCategory` | método public | 29–33 | `id: string`, `input: CategoryInput` | `Observable<Category>` |
| `deleteCategory` | método public | 36–38 | `id: string` | `Observable<void>` |

##### `CategoryService.getCategories`

- **Firma:** `getCategories(includeInactive?): Observable<Category[]>` — [category.service.ts](../../../../comercial-jhoel-app/src/app/core/services/category.service.ts#L15) (L15–19)
- **Propósito / descripción:** Active-only by default — what the product form's dropdown should offer.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [categories-page.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts)

##### `CategoryService.getCategoryById`

- **Firma:** `getCategoryById(id: string): Observable<Category>` — [category.service.ts](../../../../comercial-jhoel-app/src/app/core/services/category.service.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Category>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CategoryService.createCategory`

- **Firma:** `createCategory(input: CategoryInput): Observable<Category>` — [category.service.ts](../../../../comercial-jhoel-app/src/app/core/services/category.service.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Category>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [category-form-modal.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-form-modal-category-form-modal-component-ts)

##### `CategoryService.updateCategory`

- **Firma:** `updateCategory(id: string, input: CategoryInput): Observable<Category>` — [category.service.ts](../../../../comercial-jhoel-app/src/app/core/services/category.service.ts#L29) (L29–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<Category>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [category-form-modal.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-form-modal-category-form-modal-component-ts)

##### `CategoryService.deleteCategory`

- **Firma:** `deleteCategory(id: string): Observable<void>` — [category.service.ts](../../../../comercial-jhoel-app/src/app/core/services/category.service.ts#L36) (L36–38)
- **Propósito / descripción:** Soft delete — the backend deactivates the category, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [categories-page.component.ts](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-categories-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-client-service-ts"></a>

### client.service.ts

- **Ruta:** [client.service.ts](../../../../comercial-jhoel-app/src/app/core/services/client.service.ts) (`comercial-jhoel-app/src/app/core/services/client.service.ts`, 49 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `ClientService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [client-search-select.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-client-search-select-client-search-select-component-ts), [client-search-select.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-client-search-select-client-search-select-component-ts), [clients-page.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts), [client-form-modal.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-form-modal-client-form-modal-component-ts), [client-filter-search.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-client-filter-search-client-filter-search-component-ts), [sales-admin-page.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-sales-admin-page-component-ts)

#### Clase `ClientService` (L10–48)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getClients` | método public | 20–28 | `includeInactive?`, `search?: string` | `Observable<Client[]>` |
| `getClientById` | método public | 30–32 | `id: string` | `Observable<Client>` |
| `createClient` | método public | 34–36 | `input: ClientInput` | `Observable<Client>` |
| `updateClient` | método public | 38–42 | `id: string`, `input: ClientInput` | `Observable<Client>` |
| `deleteClient` | método public | 45–47 | `id: string` | `Observable<void>` |

##### `ClientService.getClients`

- **Firma:** `getClients(includeInactive?, search?: string): Observable<Client[]>` — [client.service.ts](../../../../comercial-jhoel-app/src/app/core/services/client.service.ts#L20) (L20–28)
- **Propósito / descripción:** Active-only by default. The admin screen passes true to also show inactive clients. `search` is forwarded to the backend's accent/case-insensitive `search_normalize()`-based match (see the API's `AddSearchNormalizationSupport` migration) — never filtered here in JS, so "garcia" finds "García" the same way everywhere else in the app.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Client[]>>(BASE_URL, { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [clients-page.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts)

##### `ClientService.getClientById`

- **Firma:** `getClientById(id: string): Observable<Client>` — [client.service.ts](../../../../comercial-jhoel-app/src/app/core/services/client.service.ts#L30) (L30–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Client>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ClientService.createClient`

- **Firma:** `createClient(input: ClientInput): Observable<Client>` — [client.service.ts](../../../../comercial-jhoel-app/src/app/core/services/client.service.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Client>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [client-form-modal.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-form-modal-client-form-modal-component-ts)

##### `ClientService.updateClient`

- **Firma:** `updateClient(id: string, input: ClientInput): Observable<Client>` — [client.service.ts](../../../../comercial-jhoel-app/src/app/core/services/client.service.ts#L38) (L38–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<Client>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [client-form-modal.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-form-modal-client-form-modal-component-ts)

##### `ClientService.deleteClient`

- **Firma:** `deleteClient(id: string): Observable<void>` — [client.service.ts](../../../../comercial-jhoel-app/src/app/core/services/client.service.ts#L45) (L45–47)
- **Propósito / descripción:** Soft delete — the backend deactivates the client, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [clients-page.component.ts](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-clients-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-closed-days-service-ts"></a>

### closed-days.service.ts

- **Ruta:** [closed-days.service.ts](../../../../comercial-jhoel-app/src/app/core/services/closed-days.service.ts) (`comercial-jhoel-app/src/app/core/services/closed-days.service.ts`, 51 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** "Sistema → Gestión de Días Cerrados" — every backend route (`ClosedDaysController`) already requires ADMIN/SUPER_ADMIN via a class-level `@Roles`; this service doesn't repeat that check, it's just the HTTP client.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [closed-days-page.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts), [day-detail-modal.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-day-detail-modal-day-detail-modal-component-ts), [transaction-day-detail-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts), [transaction-days-page.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts)

#### Clase `ClosedDaysService` (L16–50)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** "Sistema → Gestión de Días Cerrados" — every backend route (`ClosedDaysController`) already requires ADMIN/SUPER_ADMIN via a class-level `@Roles`; this service doesn't repeat that check, it's just the HTTP client. `authInterceptor` attaches the JWT automatically.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getClosedDays` | método public | 20–31 | `filters: ClosedDaysFilters` | `Observable<ClosedDayRow[]>` |
| `getDayDetail` | método public | 33–37 | `date: string` | `Observable<ClosedDayDetail>` |
| `reopenDay` | método public | 39–43 | `date: string`, `reason: string` | `Observable<ClosedDayDetail>` |
| `cancelDay` | método public | 45–49 | `date: string`, `reason: string` | `Observable<ClosedDayDetail>` |

##### `ClosedDaysService.getClosedDays`

- **Firma:** `getClosedDays(filters: ClosedDaysFilters): Observable<ClosedDayRow[]>` — [closed-days.service.ts](../../../../comercial-jhoel-app/src/app/core/services/closed-days.service.ts#L20) (L20–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<ClosedDayRow[]>>(BASE_URL, { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [closed-days-page.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts), [transaction-days-page.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts)

##### `ClosedDaysService.getDayDetail`

- **Firma:** `getDayDetail(date: string): Observable<ClosedDayDetail>` — [closed-days.service.ts](../../../../comercial-jhoel-app/src/app/core/services/closed-days.service.ts#L33) (L33–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<ClosedDayDetail>>('${BASE_URL}/${date}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${date}'`
- **Consumidores:** [day-detail-modal.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-components-day-detail-modal-day-detail-modal-component-ts), [transaction-day-detail-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts)

##### `ClosedDaysService.reopenDay`

- **Firma:** `reopenDay(date: string, reason: string): Observable<ClosedDayDetail>` — [closed-days.service.ts](../../../../comercial-jhoel-app/src/app/core/services/closed-days.service.ts#L39) (L39–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${date}/reopen'`
- **Consumidores:** [closed-days-page.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts), [transaction-days-page.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts)

##### `ClosedDaysService.cancelDay`

- **Firma:** `cancelDay(date: string, reason: string): Observable<ClosedDayDetail>` — [closed-days.service.ts](../../../../comercial-jhoel-app/src/app/core/services/closed-days.service.ts#L45) (L45–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${date}/cancel'`
- **Consumidores:** [closed-days-page.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts), [transaction-days-page.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-company-settings-service-ts"></a>

### company-settings.service.ts

- **Ruta:** [company-settings.service.ts](../../../../comercial-jhoel-app/src/app/core/services/company-settings.service.ts) (`comercial-jhoel-app/src/app/core/services/company-settings.service.ts`, 34 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `CompanySettingsService`, `BASE_URL`, `PUBLIC_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [contact.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-contact-service-ts), [company-settings-page.component.ts](dashboard-company-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-company-settings-company-settings-page-component-ts)

#### Clase `CompanySettingsService` (L11–33)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getCompanySettings` | método public | 15–19 | — | `Observable<CompanySettings>` |
| `updateCompanySettings` | método public | 21–25 | `payload: UpdateCompanySettingsPayload` | `Observable<CompanySettings>` |
| `getPublicInfo` | método public | 28–32 | — | `Observable<PublicCompanyInfo>` |

##### `CompanySettingsService.getCompanySettings`

- **Firma:** `getCompanySettings(): Observable<CompanySettings>` — [company-settings.service.ts](../../../../comercial-jhoel-app/src/app/core/services/company-settings.service.ts#L15) (L15–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<CompanySettings>>(BASE_URL).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CompanySettingsService.updateCompanySettings`

- **Firma:** `updateCompanySettings(payload: UpdateCompanySettingsPayload): Observable<CompanySettings>` — [company-settings.service.ts](../../../../comercial-jhoel-app/src/app/core/services/company-settings.service.ts#L21) (L21–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<CompanySettings>>(BASE_URL, payload).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `BASE_URL`
- **Consumidores:** [company-settings-page.component.ts](dashboard-company-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-company-settings-company-settings-page-component-ts)

##### `CompanySettingsService.getPublicInfo`

- **Firma:** `getPublicInfo(): Observable<PublicCompanyInfo>` — [company-settings.service.ts](../../../../comercial-jhoel-app/src/app/core/services/company-settings.service.ts#L28) (L28–32)
- **Propósito / descripción:** `GET /company-info` — público, sin autenticación; backs la sección "Contacto" de la landing. Nunca incluye `taxId`/`logoBase64`.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PublicCompanyInfo>>(PUBLIC_URL).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `PUBLIC_URL`
- **Consumidores:** [contact.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-contact-service-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts"></a>

### confirm-dialog.service.ts

- **Ruta:** [confirm-dialog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/confirm-dialog.service.ts) (`comercial-jhoel-app/src/app/core/services/confirm-dialog.service.ts`, 182 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Global, reusable "are you sure?" mechanism — the `ConfirmDialogService`/ `ConfirmDialogComponent` pair mirrors `NotificationService`/ `ToastContainerComponent` exactly (root-provided signal-based service + one component mounted once in `AppComponent`).
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [keyboard-shortcuts.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-keyboard-shortcuts-service-ts), [account-type-form-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts), [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts), [asset-form-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts), [cuadre-agentes-page.component.spec.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-spec-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [business-form-modal.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-form-modal-business-form-modal-component-ts), [cash-bank-deposit-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-spec-ts), [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts), [cash-count-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-spec-ts), [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts), [cash-movement-form-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-movement-form-modal-cash-movement-form-modal-component-ts), [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts), [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts), [warehouse-transfer-modal.component.spec.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-transfer-modal-warehouse-transfer-modal-component-spec-ts) y 58 más

**Interfaces, tipos y enums:**

- `interface ConfirmDialogOptions` (L23): sin documentación — miembros: `type`, `title`, `message`, `confirmText`, `cancelText`, `variant`, `icon`
- `interface ResolvedConfirmDialogOptions` (L34): sin documentación — miembros: `title`, `message`, `confirmText`, `cancelText`, `variant`, `icon`
- `interface ConfirmDialogTypeDefaults` (L43): sin documentación — miembros: `title`, `message`, `confirmText`, `cancelText`, `variant`, `icon`
- `interface PendingConfirmDialog` (L131): sin documentación — miembros: `options`, `resolve`
- `type ConfirmDialogType` (L11) = `\| 'SAVE' \| 'UPDATE' \| 'DELETE' \| 'CANCEL' \| 'CLOSE' \| 'OPEN_DAY' \| 'CLOSE_DAY' \| 'FINANCIAL_OPERATION'` — Drives the copy/icon/button-variant defaults for `ConfirmDialogComponent` — the exact type list from the "IMPLEMENTACIÓN GLOBAL DE CONFIRMACIONES" ticket.
- `type ConfirmDialogVariant` (L21) = `'primary' \| 'danger'`

#### Clase `ConfirmDialogService` (L151–181)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Global, reusable "are you sure?" mechanism — the `ConfirmDialogService`/ `ConfirmDialogComponent` pair mirrors `NotificationService`/ `ToastContainerComponent` exactly (root-provided signal-based service + one component mounted once in `AppComponent`). Only one dialog can be open at a time — `confirm()` is always awaited before the next user action is possible, so a second concurrent request is not a real case. Deliberately does NOT own a loading/`isSaving` state: the promise resolves and the dialog closes the instant the user clicks the confirm button, and the caller's own existing `isSubmitting` signal (already present on every CRUD form-modal) takes over immediately after — see the plan's own reasoning for why this keeps the rollout to a one-line `await` insertion per form instead of restructuring every consumer.
- **Datos / estado que administra:** `pending = signal<PendingConfirmDialog \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `confirm` | método public | 155–175 | `options: ConfirmDialogOptions` | `Promise<boolean>` |
| `respond` | método public | 178–180 | `confirmed: boolean` | `void` |

##### `ConfirmDialogService.confirm`

- **Firma:** `confirm(options: ConfirmDialogOptions): Promise<boolean>` — [confirm-dialog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/confirm-dialog.service.ts#L155) (L155–175)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Promise`, `this.pending.set`, `resolve`
- **Efectos secundarios:** Actualiza estado (signals): `this.pending.set`
- **Consumidores:** [account-type-form-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts), [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts), [asset-form-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [business-form-modal.component.ts](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-form-modal-business-form-modal-component-ts), [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts), [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts), [cash-movement-form-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-movement-form-modal-cash-movement-form-modal-component-ts), [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts), [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts)

##### `ConfirmDialogService.respond`

- **Firma:** `respond(confirmed: boolean): void` — [confirm-dialog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/confirm-dialog.service.ts#L178) (L178–180)
- **Propósito / descripción:** Called by `ConfirmDialogComponent` only — resolves the in-flight promise and closes the dialog.
- **Dependencias (llamadas en su cuerpo):** `this.pending()?.resolve`, `this.pending`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [confirm-dialog.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-confirm-dialog-confirm-dialog-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-contact-service-ts"></a>

### contact.service.ts

- **Ruta:** [contact.service.ts](../../../../comercial-jhoel-app/src/app/core/services/contact.service.ts) (`comercial-jhoel-app/src/app/core/services/contact.service.ts`, 99 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Digits only — `tel:`/`wa.me` links need a clean numeric string, whatever formatting the admin typed (spaces, dashes, +) is stripped.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts), [company-settings.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-company-settings-service-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [catalog-page.component.ts](catalog.md#f-comercial-jhoel-app-src-app-features-catalog-catalog-page-component-ts), [quick-access-dock.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-components-quick-access-dock-quick-access-dock-component-ts), [bank-agents.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts), [contact.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-contact-contact-component-ts), [hero.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts), [phone-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-interest-modal-phone-interest-modal-component-ts), [product-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-components-product-interest-modal-product-interest-modal-component-ts), [footer.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-footer-footer-component-ts)

**Interfaces, tipos y enums:**

- `interface ContactSubmissionResult` (L8): sin documentación — miembros: `success`
- `interface ContactInfo` (L12): sin documentación — miembros: `businessName`, `address`, `businessHours`, `channels`, `socialLinks`

#### Clase `ContactService` (L77–98)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `companySettingsService = inject(CompanySettingsService)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getInterests` | método public | 81–83 | — | `string[]` |
| `getContactInfo` | método public | 86–88 | — | `Observable<ContactInfo>` |
| `submit` | método public | 95–97 | `payload: ContactFormPayload` | `Observable<ContactSubmissionResult>` |

##### `ContactService.getInterests`

- **Firma:** `getInterests(): string[]` — [contact.service.ts](../../../../comercial-jhoel-app/src/app/core/services/contact.service.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ContactService.getContactInfo`

- **Firma:** `getContactInfo(): Observable<ContactInfo>` — [contact.service.ts](../../../../comercial-jhoel-app/src/app/core/services/contact.service.ts#L86) (L86–88)
- **Propósito / descripción:** Real data — `GET /company-info` (público, sin auth), nunca un placeholder hardcodeado.
- **Dependencias (llamadas en su cuerpo):** `this.companySettingsService.getPublicInfo().pipe`, `this.companySettingsService.getPublicInfo`, `map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [contact.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-contact-contact-component-ts)

##### `ContactService.submit`

- **Firma:** `submit(payload: ContactFormPayload): Observable<ContactSubmissionResult>` — [contact.service.ts](../../../../comercial-jhoel-app/src/app/core/services/contact.service.ts#L95) (L95–97)
- **Propósito / descripción:** Phase 2: swap for `this.http.post&lt;ContactSubmissionResult&gt;(\`${environment.apiUrl}/contact\`, payload)`. Fuera del alcance de la tarea de "Contacto con datos reales de la empresa".
- **Dependencias (llamadas en su cuerpo):** `of({ success: true }).pipe`, `of`, `delay`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [contact.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-contact-contact-component-ts)

#### Función `digitsOnly` (L21–23)

- **Tipo:** función local del archivo
- **Firma:** `digitsOnly(value: string): string` — [contact.service.ts](../../../../comercial-jhoel-app/src/app/core/services/contact.service.ts#L21)
- **Propósito / descripción:** Digits only — `tel:`/`wa.me` links need a clean numeric string, whatever formatting the admin typed (spaces, dashes, +) is stripped.
- **Dependencias:** `value.replace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [phone-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-interest-modal-phone-interest-modal-component-ts), [product-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-components-product-interest-modal-product-interest-modal-component-ts)

#### Función `withScheme` (L26–28)

- **Tipo:** función local del archivo
- **Firma:** `withScheme(url: string): string` — [contact.service.ts](../../../../comercial-jhoel-app/src/app/core/services/contact.service.ts#L26)
- **Propósito / descripción:** The admin may paste a URL with or without a scheme — `href` needs one to not resolve as a relative in-app path.
- **Dependencias:** `/^https?:\/\//i.test`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildContactInfo` (L37–75)

- **Tipo:** función local del archivo
- **Firma:** `buildContactInfo(info: PublicCompanyInfo): ContactInfo` — [contact.service.ts](../../../../comercial-jhoel-app/src/app/core/services/contact.service.ts#L37)
- **Propósito / descripción:** Only ever includes a channel/social link whose real value exists — never a placeholder `href="#"` or an "undefined" row. Built once, here, from the single real source of truth (`company_settings` via the public `/company-info` endpoint) — never a second, parallel definition of what "contact info" means.
- **Dependencias:** `channels.push`, `digitsOnly`, `encodeURIComponent`, `info.website.replace`, `withScheme`, `socialLinks.push`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-state-service-spec-ts"></a>

### cuadre-agentes-state.service.spec.ts

- **Ruta:** [cuadre-agentes-state.service.spec.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes-state.service.spec.ts) (`comercial-jhoel-app/src/app/core/services/cuadre-agentes-state.service.spec.ts`, 58 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Prueba unitaria: declara `INFO` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cuadre-agentes-state.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-state-service-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-state-service-ts"></a>

### cuadre-agentes-state.service.ts

- **Ruta:** [cuadre-agentes-state.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes-state.service.ts) (`comercial-jhoel-app/src/app/core/services/cuadre-agentes-state.service.ts`, 71 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Holds the Cuadre Agentes page's cash-count quantities in a root-provided singleton — the same `providedIn: 'root'` + signals technique the draft stores use for surviving component destruction on route navigation.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [cuadre-agentes-state.service.spec.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-state-service-spec-ts), [cuadre-agentes-page.component.spec.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-spec-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

#### Clase `CuadreAgentesStateService` (L25–70)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Holds the Cuadre Agentes page's cash-count quantities in a root-provided singleton — the same `providedIn: 'root'` + signals technique the draft stores use for surviving component destruction on route navigation. In-memory only: losing an unsaved count on a hard reload is acceptable. Also tracks the breakdown's origin: a manual count, or the latest Arqueo de Caja loaded as a starting point (and whether it was edited afterwards). The arqueo is only copied into this local state — never modified.
- **Datos / estado que administra:** `cashCounts = signal<CashCount>(createEmptyCashCount())`, `origin = signal<CashBreakdownOrigin>(MANUAL_ORIGIN)`, `hasQuantities = computed(() => hasAnyQuantity(this.cashCounts()))`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `setCount` | método public | 34–42 | `denomination: CashDenomination`, `quantity: number` | `void` |
| `loadFromCount` | método public | 45–48 | `counts: CashCount`, `info: LoadedCashCountInfo` | `void` |
| `clear` | método public | 51–54 | — | `void` |
| `details` | método public | 57–60 | — | `Array<{ denomination: number; quantity: number }>` |
| `reset` | método public | 67–69 | — | `void` |

##### `CuadreAgentesStateService.setCount`

- **Firma:** `setCount(denomination: CashDenomination, quantity: number): void` — [cuadre-agentes-state.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes-state.service.ts#L34) (L34–42)
- **Propósito / descripción:** Manual edit of one row — after loading an arqueo it marks the breakdown as modified.
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts`, `this.cashCounts.update`, `this.origin`, `this.origin.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.update`, `this.origin.update`
- **Consumidores:** [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

##### `CuadreAgentesStateService.loadFromCount`

- **Firma:** `loadFromCount(counts: CashCount, info: LoadedCashCountInfo): void` — [cuadre-agentes-state.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes-state.service.ts#L45) (L45–48)
- **Propósito / descripción:** Replaces every quantity with an arqueo's breakdown (as an independent copy).
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts.set`, `this.origin.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.set`, `this.origin.set`
- **Consumidores:** [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

##### `CuadreAgentesStateService.clear`

- **Firma:** `clear(): void` — [cuadre-agentes-state.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes-state.service.ts#L51) (L51–54)
- **Propósito / descripción:** "Limpiar": empty form, origin back to "Conteo manual".
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts.set`, `createEmptyCashCount`, `this.origin.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.cashCounts.set`, `this.origin.set`
- **Consumidores:** [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), (mismo archivo)

##### `CuadreAgentesStateService.details`

- **Firma:** `details(): Array<{ denomination: number; quantity: number }>` — [cuadre-agentes-state.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes-state.service.ts#L57) (L57–60)
- **Propósito / descripción:** Every denomination with its quantity — the exact breakdown sent with the cuadre.
- **Dependencias (llamadas en su cuerpo):** `this.cashCounts`, `CASH_DENOMINATIONS.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

##### `CuadreAgentesStateService.reset`

- **Firma:** `reset(): void` — [cuadre-agentes-state.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes-state.service.ts#L67) (L67–69)
- **Propósito / descripción:** Called only after a successful "Guardar Cuadre". Only clears this temporary in-memory state; the historical record (with its breakdown photograph) is already saved before this runs.
- **Dependencias (llamadas en su cuerpo):** `this.clear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-service-ts"></a>

### cuadre-agentes.service.ts

- **Ruta:** [cuadre-agentes.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts) (`comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts`, 63 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `CuadreAgentesService`, `BASE_URL`, `RECONCILIATIONS_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-day-status-service-ts), [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [cuadre-agentes-page.component.spec.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-spec-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

#### Clase `CuadreAgentesService` (L18–62)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSummary` | método public | 22–26 | — | `Observable<CuadreAgentesSummary>` |
| `registerReconciliation` | método public | 29–33 | `input: RegisterAgentReconciliationInput` | `Observable<AgentReconciliation>` |
| `validateBankBalances` | método public | 41–47 | `date?: string` | `Observable<BankBalancesValidation>` |
| `getDayStatus` | método public | 50–54 | `date?: string` | `Observable<DayStatus>` |
| `openDay` | método public | 57–61 | `date?: string` | `Observable<DayStatus>` |

##### `CuadreAgentesService.getSummary`

- **Firma:** `getSummary(): Observable<CuadreAgentesSummary>` — [cuadre-agentes.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts#L22) (L22–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/cuadre-agentes-summary'`
- **Consumidores:** [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

##### `CuadreAgentesService.registerReconciliation`

- **Firma:** `registerReconciliation(input: RegisterAgentReconciliationInput): Observable<AgentReconciliation>` — [cuadre-agentes.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts#L29) (L29–33)
- **Propósito / descripción:** Second stage — "Guardar Cuadre". Only `totalCash` travels to the backend; every other total and the result are always recomputed by the server.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<AgentReconciliation>>(RECONCILIATIONS_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `RECONCILIATIONS_URL`
- **Consumidores:** [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

##### `CuadreAgentesService.validateBankBalances`

- **Firma:** `validateBankBalances(date?: string): Observable<BankBalancesValidation>` — [cuadre-agentes.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts#L41) (L41–47)
- **Propósito / descripción:** "Were this date's bank balances saved?" — the pre-check that enables/blocks "Guardar Cuadre" on screen. UX only: `registerReconciliation` enforces this again independently on the backend before saving.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/balances/validation'`
- **Consumidores:** [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts)

##### `CuadreAgentesService.getDayStatus`

- **Firma:** `getDayStatus(date?: string): Observable<DayStatus>` — [cuadre-agentes.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts#L50) (L50–54)
- **Propósito / descripción:** "Is the day open? Were balances saved? Can Cuadre Agentes be entered?" — the four questions of the mandatory sequence in one call.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/day-status'`
- **Consumidores:** [day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-day-status-service-ts), [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts)

##### `CuadreAgentesService.openDay`

- **Firma:** `openDay(date?: string): Observable<DayStatus>` — [cuadre-agentes.service.ts](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts#L57) (L57–61)
- **Propósito / descripción:** "Confirmar Apertura" — idempotent on the backend, so calling it twice never fails or duplicates anything.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/day-status/open'`
- **Consumidores:** [day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-day-status-service-ts), [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-dashboard-metrics-service-ts"></a>

### dashboard-metrics.service.ts

- **Ruta:** [dashboard-metrics.service.ts](../../../../comercial-jhoel-app/src/app/core/services/dashboard-metrics.service.ts) (`comercial-jhoel-app/src/app/core/services/dashboard-metrics.service.ts`, 21 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Admin-only on the backend (`@Roles`) — the caller (`DashboardHomeComponent`) is responsible for only invoking this when `AuthService.isAdmin()` is true; a `USER`-role token gets a real `403` from the backend regardless.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [dashboard-home.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts)

#### Clase `DashboardMetricsService` (L11–20)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Admin-only on the backend (`@Roles`) — the caller (`DashboardHomeComponent`) is responsible for only invoking this when `AuthService.isAdmin()` is true; a `USER`-role token gets a real `403` from the backend regardless.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSummary` | método public | 15–19 | — | `Observable<DashboardMetrics>` |

##### `DashboardMetricsService.getSummary`

- **Firma:** `getSummary(): Observable<DashboardMetrics>` — [dashboard-metrics.service.ts](../../../../comercial-jhoel-app/src/app/core/services/dashboard-metrics.service.ts#L15) (L15–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<DashboardMetrics>>('${BASE_URL}/summary').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/summary'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-dashboard-summary-service-ts"></a>

### dashboard-summary.service.ts

- **Ruta:** [dashboard-summary.service.ts](../../../../comercial-jhoel-app/src/app/core/services/dashboard-summary.service.ts) (`comercial-jhoel-app/src/app/core/services/dashboard-summary.service.ts`, 17 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Phase 2: replace the `of(...)` body with `this.http.get&lt;DashboardSummaryItem[]&gt;(\`${environment.apiUrl}/dashboard/summary\`)`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [dashboard-home.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts)

#### Clase `DashboardSummaryService` (L11–16)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Phase 2: replace the `of(...)` body with `this.http.get&lt;DashboardSummaryItem[]&gt;(\`${environment.apiUrl}/dashboard/summary\`)`.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSummary` | método public | 13–15 | — | `Observable<DashboardSummaryItem[]>` |

##### `DashboardSummaryService.getSummary`

- **Firma:** `getSummary(): Observable<DashboardSummaryItem[]>` — [dashboard-summary.service.ts](../../../../comercial-jhoel-app/src/app/core/services/dashboard-summary.service.ts#L13) (L13–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `of`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-day-status-service-ts"></a>

### day-status.service.ts

- **Ruta:** [day-status.service.ts](../../../../comercial-jhoel-app/src/app/core/services/day-status.service.ts) (`comercial-jhoel-app/src/app/core/services/day-status.service.ts`, 54 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Shared "is today's day open?" state — a `providedIn: 'root'` singleton, same pattern as `PurchaseDraftStore`/`SalesDraftStore` (see those files), so the Sidebar (mounted once for all of `/dashboard/*`) and the Bancos page (destroyed and recreated on every navigation) read and write exactly the same signal.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [cuadre-agentes.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-cuadre-agentes-service-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [cuadre-agentes-page.component.spec.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-spec-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [closed-days-page.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts), [dashboard-sidebar.component.ts](dashboard-sidebar.md#f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts), [transaction-days-page.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts)

#### Clase `DayStatusService` (L21–53)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Shared "is today's day open?" state — a `providedIn: 'root'` singleton, same pattern as `PurchaseDraftStore`/`SalesDraftStore` (see those files), so the Sidebar (mounted once for all of `/dashboard/*`) and the Bancos page (destroyed and recreated on every navigation) read and write exactly the same signal. This is what makes saving balances or opening the day in Bancos update the Cuadre Agentes sidebar link immediately, with no page reload — the same mechanism Ventas/Compras' own "draft in progress" indicator dots already use. Always represents TODAY — Cuadre Agentes has no date selector of its own, and this ticket's mandatory sequence is explicitly about "the current day", not an arbitrary date.
- **Servicios inyectados con `inject()`:** `cuadreAgentesService = inject(CuadreAgentesService)`
- **Datos / estado que administra:** `status = signal<DayStatus \| null>(null)`, `loading = signal(true)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `refresh` | método public | 32–48 | — | `void` |
| `openDay` | método public | 50–52 | — | `Observable<DayStatus>` |

##### `DayStatusService.refresh`

- **Firma:** `refresh(): void` — [day-status.service.ts](../../../../comercial-jhoel-app/src/app/core/services/day-status.service.ts#L32) (L32–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.cuadreAgentesService.getDayStatus().subscribe`, `this.cuadreAgentesService.getDayStatus`, `this.status.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.status.set`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [closed-days-page.component.ts](dashboard-closed-days.md#f-comercial-jhoel-app-src-app-features-dashboard-closed-days-closed-days-page-component-ts), [transaction-days-page.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-transaction-days-page-component-ts)

##### `DayStatusService.openDay`

- **Firma:** `openDay(): Observable<DayStatus>` — [day-status.service.ts](../../../../comercial-jhoel-app/src/app/core/services/day-status.service.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.cuadreAgentesService.openDay().pipe`, `this.cuadreAgentesService.openDay`, `tap`, `this.status.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.status.set`
- **Consumidores:** [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-financial-day-review-service-ts"></a>

### financial-day-review.service.ts

- **Ruta:** [financial-day-review.service.ts](../../../../comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts) (`comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts`, 137 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** API client of "Revisión de días operativos".
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [financial-day-review-page.component.spec.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-spec-ts), [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts)

**Interfaces, tipos y enums:**

- `interface CorrectionMeta` (L20): Common fields of every correction: mandatory reason + one idempotency key per attempt. — miembros: `reason`, `observations`, `requestId`

#### Clase `FinancialDayReviewService` (L31–136)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** API client of "Revisión de días operativos". Writes only send what the administrator decided (corrected value, reason, request id); the backend validates the day, recalculates and audits.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `listDays` | método public | 36–43 | `from: string`, `to: string` | `Observable<FinancialDayListItem[]>` |
| `getDay` | método public | 46–50 | `date: string` | `Observable<FinancialDayDetail>` |
| `listCorrections` | método public | 53–60 | `date: string` | `Observable<ReviewCorrection[]>` |
| `openReview` | método public | 63–71 | `date: string`, `reason: string` | `Observable<ReviewSession>` |
| `correctSnapshot` | método public | 74–92 | `sessionId: string`, `input: { target: SnapshotTarget; targetId: string; field: string; newValue: number; } & CorrectionMeta` | `Observable<ReviewCorrection>` |
| `adjustMovement` | método public | 95–112 | `sessionId: string`, `input: { source: MovementSource; sourceId: string; correctedAmount: number; } & CorrectionMeta` | `Observable<ReviewCorrection>` |
| `requestClose` | método public | 115–122 | `sessionId: string` | `Observable<CloseReviewSummary>` |
| `close` | método public | 125–135 | `sessionId: string`, `input: { observations?: string; acceptPendingDifferences: boolean }` | `Observable<ReviewSession>` |

##### `FinancialDayReviewService.listDays`

- **Firma:** `listDays(from: string, to: string): Observable<FinancialDayListItem[]>` — [financial-day-review.service.ts](../../../../comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts#L36) (L36–43)
- **Propósito / descripción:** Calendar/table rows for an inclusive date range.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams().set('from', from).set`, `new HttpParams().set`, `new HttpParams`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/days'`
- **Consumidores:** [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts)

##### `FinancialDayReviewService.getDay`

- **Firma:** `getDay(date: string): Observable<FinancialDayDetail>` — [financial-day-review.service.ts](../../../../comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts#L46) (L46–50)
- **Propósito / descripción:** Full diagnosis of one day + its review sessions and corrections.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<FinancialDayDetail>>('${BASE_URL}/days/${date}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/days/${date}'`
- **Consumidores:** [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts)

##### `FinancialDayReviewService.listCorrections`

- **Firma:** `listCorrections(date: string): Observable<ReviewCorrection[]>` — [financial-day-review.service.ts](../../../../comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts#L53) (L53–60)
- **Propósito / descripción:** Audit trail of one day.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams().set`, `new HttpParams`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/corrections'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialDayReviewService.openReview`

- **Firma:** `openReview(date: string, reason: string): Observable<ReviewSession>` — [financial-day-review.service.ts](../../../../comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts#L63) (L63–71)
- **Propósito / descripción:** "ABRIR DÍA PARA REVISIÓN" (creates the audited session; changes no data).
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/sessions'`
- **Consumidores:** [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts)

##### `FinancialDayReviewService.correctSnapshot`

- **Firma:** `correctSnapshot(sessionId: string, input: { target: SnapshotTarget; targetId: string; field: string; newValue: number; } & CorrectionMeta): Observable<ReviewCorrection>` — [financial-day-review.service.ts](../../../../comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts#L74) (L74–92)
- **Propósito / descripción:** Corrects a snapshot value of the reviewed day (versioned in the backend).
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/sessions/${sessionId}/snapshot-corrections'`
- **Consumidores:** [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts)

##### `FinancialDayReviewService.adjustMovement`

- **Firma:** `adjustMovement(sessionId: string, input: { source: MovementSource; sourceId: string; correctedAmount: number; } & CorrectionMeta): Observable<ReviewCorrection>` — [financial-day-review.service.ts](../../../../comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts#L95) (L95–112)
- **Propósito / descripción:** Corrects a movement amount through a linked adjustment (the original is kept).
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/sessions/${sessionId}/movement-adjustments'`
- **Consumidores:** [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts)

##### `FinancialDayReviewService.requestClose`

- **Firma:** `requestClose(sessionId: string): Observable<CloseReviewSummary>` — [financial-day-review.service.ts](../../../../comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts#L115) (L115–122)
- **Propósito / descripción:** Moves the session to "pending confirmation" and returns the close summary.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/sessions/${sessionId}/close-request'`
- **Consumidores:** [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts)

##### `FinancialDayReviewService.close`

- **Firma:** `close(sessionId: string, input: { observations?: string; acceptPendingDifferences: boolean }): Observable<ReviewSession>` — [financial-day-review.service.ts](../../../../comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts#L125) (L125–135)
- **Propósito / descripción:** Final, explicit close of the review.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/sessions/${sessionId}/close'`
- **Consumidores:** [financial-day-review-page.component.ts](dashboard-financial-day-review.md#f-comercial-jhoel-app-src-app-features-dashboard-financial-day-review-financial-day-review-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-fragment-scroll-service-ts"></a>

### fragment-scroll.service.ts

- **Ruta:** [fragment-scroll.service.ts](../../../../comercial-jhoel-app/src/app/core/services/fragment-scroll.service.ts) (`comercial-jhoel-app/src/app/core/services/fragment-scroll.service.ts`, 43 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Owns all scroll-on-navigation behavior, replacing the router's built-in `withInMemoryScrolling` (see app.config.ts for why): scrolls to top on a plain route change, or to the element matching the URL fragment (e.g.
- **Paquetes externos:** `@angular/core`, `@angular/router`
- **Consumidores:** [app.component.ts](root.md#f-comercial-jhoel-app-src-app-app-component-ts)

#### Clase `FragmentScrollService` (L17–42)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Owns all scroll-on-navigation behavior, replacing the router's built-in `withInMemoryScrolling` (see app.config.ts for why): scrolls to top on a plain route change, or to the element matching the URL fragment (e.g. #contacto) otherwise. Reads the fragment straight off the root route rather than NavigationEnd, since NavigationEnd does not fire for a fragment-only change on an already-active route.
- **Servicios inyectados con `inject()`:** `router = inject(Router)`, `destroyRef = inject(DestroyRef)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `listen` | método public | 22–30 | — | `void` |
| `scrollWhenReady` | método private | 32–41 | `fragment: string`, `retriesLeft: number` | `void` |

##### `FragmentScrollService.listen`

- **Firma:** `listen(): void` — [fragment-scroll.service.ts](../../../../comercial-jhoel-app/src/app/core/services/fragment-scroll.service.ts#L22) (L22–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.router.routerState.root.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe`, `this.router.routerState.root.fragment.pipe`, `takeUntilDestroyed`, `this.scrollWhenReady`, `window.scrollTo`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FragmentScrollService.scrollWhenReady`

- **Firma:** `scrollWhenReady(fragment: string, retriesLeft: number): void` — [fragment-scroll.service.ts](../../../../comercial-jhoel-app/src/app/core/services/fragment-scroll.service.ts#L32) (L32–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `document.getElementById`, `element.scrollIntoView`, `requestAnimationFrame`, `this.scrollWhenReady`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-core-services-guayacan-cash-box-service-ts"></a>

### guayacan-cash-box.service.ts

- **Ruta:** [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts) (`comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts`, 120 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Cuadre de Caja Guayacán.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [cash-count-panel.component.spec.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-spec-ts), [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts), [count-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-count-detail-modal-count-detail-modal-component-ts), [movement-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-detail-modal-movement-detail-modal-component-ts), [movement-form-modal.component.spec.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-spec-ts), [movement-form-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts), [guayacan-cash-box-page.component.spec.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-spec-ts), [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts), [guayacan-cash-counts-page.component.spec.ts](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-spec-ts), [guayacan-cash-counts-page.component.ts](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts)

#### Clase `GuayacanCashBoxService` (L39–119)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Cuadre de Caja Guayacán. El backend es la única fuente del saldo: cada escritura devuelve el movimiento ya calculado (saldo anterior/nuevo) y esta capa nunca recalcula nada. `clientRequestId` (uno por modal abierto) hace que un doble clic o reintento devuelva el mismo movimiento.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSummary` | método public | 43–47 | — | `Observable<GuayacanCashBoxSummary>` |
| `getMovements` | método public | 49–53 | `filters: GuayacanCashMovementFilters` | `Observable<PaginatedGuayacanCashMovements>` |
| `getCommissions` | método public | 56–60 | `filters: { startDate?: string; endDate?: string; page?: number; limit?: number }` | `Observable<PaginatedGuayacanCommissions>` |
| `getCounts` | método public | 63–67 | `filters: GuayacanCashCountFilters` | `Observable<PaginatedGuayacanCashCounts>` |
| `getCount` | método public | 69–73 | `id: string` | `Observable<GuayacanCashCount>` |
| `getCountUsers` | método public | 75–79 | — | `Observable<{ id: string; username: string }[]>` |
| `getMovement` | método public | 81–85 | `id: string` | `Observable<GuayacanCashMovementDetail>` |
| `registerMovement` | método public | 87–91 | `input: RegisterGuayacanCashMovementInput` | `Observable<GuayacanCashMovementDetail>` |
| `registerAdjustment` | método public | 94–98 | `input: RegisterGuayacanCashAdjustmentInput` | `Observable<GuayacanCashMovementDetail>` |
| `voidMovement` | método public | 101–105 | `id: string`, `reason: string` | `Observable<GuayacanCashMovementDetail>` |
| `getLatestCount` | método public | 107–111 | — | `Observable<GuayacanCashCount \| null>` |
| `registerCount` | método public | 114–118 | `input: RegisterGuayacanCashCountInput` | `Observable<GuayacanCashCount>` |

##### `GuayacanCashBoxService.getSummary`

- **Firma:** `getSummary(): Observable<GuayacanCashBoxSummary>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L43) (L43–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<GuayacanCashBoxSummary>>('${BASE_URL}/summary').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/summary'`
- **Consumidores:** [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts)

##### `GuayacanCashBoxService.getMovements`

- **Firma:** `getMovements(filters: GuayacanCashMovementFilters): Observable<PaginatedGuayacanCashMovements>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L49) (L49–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/movements'`
- **Consumidores:** [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts)

##### `GuayacanCashBoxService.getCommissions`

- **Firma:** `getCommissions(filters: { startDate?: string; endDate?: string; page?: number; limit?: number }): Observable<PaginatedGuayacanCommissions>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L56) (L56–60)
- **Propósito / descripción:** Comisiones (concepto aparte del efectivo), más reciente primero.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/commissions'`
- **Consumidores:** [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts)

##### `GuayacanCashBoxService.getCounts`

- **Firma:** `getCounts(filters: GuayacanCashCountFilters): Observable<PaginatedGuayacanCashCounts>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L63) (L63–67)
- **Propósito / descripción:** Historial de arqueos (Cajas y Cierres → Arqueos — Guayacán).
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/counts'`
- **Consumidores:** [guayacan-cash-counts-page.component.ts](dashboard-guayacan-cash-counts.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-counts-guayacan-cash-counts-page-component-ts)

##### `GuayacanCashBoxService.getCount`

- **Firma:** `getCount(id: string): Observable<GuayacanCashCount>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L69) (L69–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<GuayacanCashCount>>('${BASE_URL}/counts/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/counts/${id}'`
- **Consumidores:** [count-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-count-detail-modal-count-detail-modal-component-ts)

##### `GuayacanCashBoxService.getCountUsers`

- **Firma:** `getCountUsers(): Observable<{ id: string; username: string }[]>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L75) (L75–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/counts/users'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `GuayacanCashBoxService.getMovement`

- **Firma:** `getMovement(id: string): Observable<GuayacanCashMovementDetail>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L81) (L81–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/movements/${id}'`
- **Consumidores:** [movement-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-detail-modal-movement-detail-modal-component-ts)

##### `GuayacanCashBoxService.registerMovement`

- **Firma:** `registerMovement(input: RegisterGuayacanCashMovementInput): Observable<GuayacanCashMovementDetail>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L87) (L87–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/movements'`
- **Consumidores:** [movement-form-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts)

##### `GuayacanCashBoxService.registerAdjustment`

- **Firma:** `registerAdjustment(input: RegisterGuayacanCashAdjustmentInput): Observable<GuayacanCashMovementDetail>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L94) (L94–98)
- **Propósito / descripción:** Admin.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/adjustments'`
- **Consumidores:** [movement-form-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-form-modal-movement-form-modal-component-ts)

##### `GuayacanCashBoxService.voidMovement`

- **Firma:** `voidMovement(id: string, reason: string): Observable<GuayacanCashMovementDetail>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L101) (L101–105)
- **Propósito / descripción:** Admin — nunca borra: el original queda ANULADO y se registra el movimiento inverso.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/movements/${id}/void'`
- **Consumidores:** [movement-detail-modal.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-movement-detail-modal-movement-detail-modal-component-ts)

##### `GuayacanCashBoxService.getLatestCount`

- **Firma:** `getLatestCount(): Observable<GuayacanCashCount \| null>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L107) (L107–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/counts/latest'`
- **Consumidores:** [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts)

##### `GuayacanCashBoxService.registerCount`

- **Firma:** `registerCount(input: RegisterGuayacanCashCountInput): Observable<GuayacanCashCount>` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L114) (L114–118)
- **Propósito / descripción:** Arqueo: registra el conteo físico y su diferencia; no cambia el saldo.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<GuayacanCashCount>>('${BASE_URL}/counts', input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/counts'`
- **Consumidores:** [cash-count-panel.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-components-cash-count-panel-cash-count-panel-component-ts)

#### Función `toParams` (L23–31)

- **Tipo:** función local del archivo
- **Firma:** `toParams(filters: object): HttpParams` — [guayacan-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-box.service.ts#L23)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new HttpParams`, `Object.entries`, `params.set`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-spec-ts"></a>

### guayacan-cash-sync.service.spec.ts

- **Ruta:** [guayacan-cash-sync.service.spec.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-sync.service.spec.ts) (`comercial-jhoel-app/src/app/core/services/guayacan-cash-sync.service.spec.ts`, 39 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [guayacan-cash-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** —
<a id="f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-ts"></a>

### guayacan-cash-sync.service.ts

- **Ruta:** [guayacan-cash-sync.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-sync.service.ts) (`comercial-jhoel-app/src/app/core/services/guayacan-cash-sync.service.ts`, 46 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Aviso "cambió el efectivo de Cooperativa Guayacán".
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [guayacan-cash-sync.service.spec.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-spec-ts), [guayacan-cash-box-page.component.spec.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-spec-ts), [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [transaccionar-page.component.spec.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-spec-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [bank-balance-strip.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts)

#### Clase `GuayacanCashSyncService` (L18–39)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Aviso "cambió el efectivo de Cooperativa Guayacán". El saldo de Guayacán es UNO solo (el Kardex de Cuadre de Caja, ver `guayacan_cash_balance()` en el API): lo muestran Transaccionar (tira de saldos, selector de bancos, vista previa) y Cuadre de Caja Guayacán. Este servicio no guarda ni calcula ningún saldo — solo avisa, y cada vista vuelve a leer del backend. Misma pestaña: `Subject`. Otras pestañas/ventanas: `BroadcastChannel` (complementa `refetchOnTabVisible`, que solo cubre volver a una pestaña oculta). Si el navegador no tiene BroadcastChannel, queda el refresco al volver a la pestaña.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `notifyChanged` | método public | 35–38 | — | `void` |

##### `GuayacanCashSyncService.notifyChanged`

- **Firma:** `notifyChanged(): void` — [guayacan-cash-sync.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-sync.service.ts#L35) (L35–38)
- **Propósito / descripción:** Llamar después de que el backend confirmó una escritura que mueve el efectivo de Guayacán.
- **Dependencias (llamadas en su cuerpo):** `this.local.next`, `this.channel?.postMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [guayacan-cash-box-page.component.ts](dashboard-guayacan-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-guayacan-cash-box-guayacan-cash-box-page-component-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

#### Función `onGuayacanCashChanged` (L42–45)

- **Tipo:** función exportada
- **Firma:** `onGuayacanCashChanged(callback: () => void): void` — [guayacan-cash-sync.service.ts](../../../../comercial-jhoel-app/src/app/core/services/guayacan-cash-sync.service.ts#L42)
- **Propósito / descripción:** Suscribe `callback` a los cambios de efectivo de Guayacán y se desuscribe al destruirse el componente (contexto de inyección).
- **Dependencias:** `inject(GuayacanCashSyncService).changed$.subscribe`, `inject`, `inject(DestroyRef).onDestroy`, `subscription.unsubscribe`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-app-src-app-core-services-ice-cream-purchase-draft-store-ts"></a>

### ice-cream-purchase-draft.store.ts

- **Ruta:** [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts) (`comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts`, 149 líneas)
- **Tipo:** Store (estado) · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** The in-progress "Compras de Heladería" invoice — same root-provided, sessionStorage-backed singleton pattern as `PurchaseDraftStore` (see that file's own doc comment for the full reasoning).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app-update.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-app-update-service-ts), [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts), [dashboard-sidebar.component.ts](dashboard-sidebar.md#f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts)

**Interfaces, tipos y enums:**

- `interface PersistedIceCreamPurchaseDraft` (L12): sin documentación — miembros: `supplierId`, `purchaseDate`, `items`

#### Clase `IceCreamPurchaseDraftStore` (L27–148)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** The in-progress "Compras de Heladería" invoice — same root-provided, sessionStorage-backed singleton pattern as `PurchaseDraftStore` (see that file's own doc comment for the full reasoning). Nothing is sent to the backend until "Guardar compra", which confirms the whole invoice atomically via `confirm_ice_cream_purchase`.
- **Servicios inyectados con `inject()`:** `authService = inject(AuthService)`
- **Datos / estado que administra:** `supplierId = signal('')`, `purchaseDate = signal(todayIsoDate())`, `items = signal<IceCreamPurchaseDraftItem[]>([])`, `total = computed(() => calculateIceCreamPurchaseTotal(this`, `hasActiveDraft = computed(() => this.items().length > 0)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onIceCreamSelected` | método public | 42–61 | `iceCream: IceCream` | `void` |
| `updateQuantity` | método public | 64–69 | `iceCreamId: string`, `quantity: number` | `void` |
| `updateCostPrice` | método public | 71–76 | `iceCreamId: string`, `costPrice: number` | `void` |
| `removeItem` | método public | 78–81 | `iceCreamId: string` | `void` |
| `setSupplier` | método public | 83–86 | `supplierId: string` | `void` |
| `setPurchaseDate` | método public | 88–91 | `date: string` | `void` |
| `reset` | método public | 93–98 | — | `void` |
| `persist` | método private | 100–116 | — | `void` |
| `restore` | método private | 118–135 | — | `void` |
| `clearStorage` | método private | 137–142 | — | `void` |
| `storageKey` | método private | 144–147 | — | `string \| null` |

##### `IceCreamPurchaseDraftStore.onIceCreamSelected`

- **Firma:** `onIceCreamSelected(iceCream: IceCream): void` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L42) (L42–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `items.find`, `items.map`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts)

##### `IceCreamPurchaseDraftStore.updateQuantity`

- **Firma:** `updateQuantity(iceCreamId: string, quantity: number): void` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L64) (L64–69)
- **Propósito / descripción:** `quantity` arrives already clamped (≥1) by the items table — this just applies it.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `items.map`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts)

##### `IceCreamPurchaseDraftStore.updateCostPrice`

- **Firma:** `updateCostPrice(iceCreamId: string, costPrice: number): void` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L71) (L71–76)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `items.map`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts)

##### `IceCreamPurchaseDraftStore.removeItem`

- **Firma:** `removeItem(iceCreamId: string): void` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L78) (L78–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `items.filter`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts)

##### `IceCreamPurchaseDraftStore.setSupplier`

- **Firma:** `setSupplier(supplierId: string): void` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L83) (L83–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.supplierId.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.supplierId.set`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts)

##### `IceCreamPurchaseDraftStore.setPurchaseDate`

- **Firma:** `setPurchaseDate(date: string): void` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L88) (L88–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.purchaseDate.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.purchaseDate.set`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts)

##### `IceCreamPurchaseDraftStore.reset`

- **Firma:** `reset(): void` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L93) (L93–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.set`, `this.supplierId.set`, `this.purchaseDate.set`, `todayIsoDate`, `this.clearStorage`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.set`, `this.supplierId.set`, `this.purchaseDate.set`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts)

##### `IceCreamPurchaseDraftStore.persist`

- **Firma:** `persist(): void` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L100) (L100–116)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `this.supplierId`, `this.purchaseDate`, `this.items`, `sessionStorage.setItem`, `JSON.stringify`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `IceCreamPurchaseDraftStore.restore`

- **Firma:** `restore(): void` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L118) (L118–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `sessionStorage.getItem`, `JSON.parse`, `this.supplierId.set`, `this.purchaseDate.set`, `todayIsoDate`, `this.items.set`, `Array.isArray`, `sessionStorage.removeItem`
- **Efectos secundarios:** Actualiza estado (signals): `this.supplierId.set`, `this.purchaseDate.set`, `this.items.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchaseDraftStore.clearStorage`

- **Firma:** `clearStorage(): void` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L137) (L137–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `sessionStorage.removeItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `IceCreamPurchaseDraftStore.storageKey`

- **Firma:** `storageKey(): string \| null` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L144) (L144–147)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.authService.currentUser`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `todayIsoDate` (L6–10)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [ice-cream-purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchase-draft.store.ts#L6)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `now.getTimezoneOffset`, `new Date(now.getTime() - offset * 60_000).toISOString().slice`, `new Date(now.getTime() - offset * 60_000).toISOString`, `now.getTime`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-ice-cream-purchases-service-ts"></a>

### ice-cream-purchases.service.ts

- **Ruta:** [ice-cream-purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchases.service.ts) (`comercial-jhoel-app/src/app/core/services/ice-cream-purchases.service.ts`, 34 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `IceCreamPurchasesService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts)

#### Clase `IceCreamPurchasesService` (L10–33)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `createPurchase` | método public | 15–19 | `input: CreateIceCreamPurchaseInput` | `Observable<IceCreamPurchase>` |
| `getPurchases` | método public | 22–26 | — | `Observable<PaginatedResponse<IceCreamPurchase>>` |
| `getPurchaseById` | método public | 28–32 | `id: string` | `Observable<IceCreamPurchase>` |

##### `IceCreamPurchasesService.createPurchase`

- **Firma:** `createPurchase(input: CreateIceCreamPurchaseInput): Observable<IceCreamPurchase>` — [ice-cream-purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchases.service.ts#L15) (L15–19)
- **Propósito / descripción:** One atomic call — the backend's `confirm_ice_cream_purchase` function creates the purchase, its details, and increases stock/cost price.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<IceCreamPurchase>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts)

##### `IceCreamPurchasesService.getPurchases`

- **Firma:** `getPurchases(): Observable<PaginatedResponse<IceCreamPurchase>>` — [ice-cream-purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchases.service.ts#L22) (L22–26)
- **Propósito / descripción:** A USER account only ever gets their own purchases back — the backend decides that, not this call.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PaginatedResponse<IceCreamPurchase>>>(BASE_URL).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamPurchasesService.getPurchaseById`

- **Firma:** `getPurchaseById(id: string): Observable<IceCreamPurchase>` — [ice-cream-purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchases.service.ts#L28) (L28–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<IceCreamPurchase>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-ice-cream-report-state-service-ts"></a>

### ice-cream-report-state.service.ts

- **Ruta:** [ice-cream-report-state.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-report-state.service.ts) (`comercial-jhoel-app/src/app/core/services/ice-cream-report-state.service.ts`, 42 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Holds the Reportería de Heladería page's checkboxes, filters, and last-fetched results in a root-provided singleton — same reasoning as `AssetsReceivablesReportStateService` (see its own doc comment).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts)

#### Clase `IceCreamReportStateService` (L10–41)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Holds the Reportería de Heladería page's checkboxes, filters, and last-fetched results in a root-provided singleton — same reasoning as `AssetsReceivablesReportStateService` (see its own doc comment).
- **Datos / estado que administra:** `draftIncludeSales = signal(true)`, `draftIncludePurchases = signal(true)`, `draftIceCream = signal<IceCream \| null>(null)`, `draftUser = signal<User \| null>(null)`, `draftStartDate = signal('')`, `draftEndDate = signal('')`, `includeSales = signal(true)`, `includePurchases = signal(true)`, `iceCream = signal<IceCream \| null>(null)`, `user = signal<User \| null>(null)`, `startDate = signal('')`, `endDate = signal('')`, `page = signal(1)`, `rows = signal<IceCreamReportRow[]>([])`, `total = signal(0)`, `summary = signal<IceCreamReportSummary \| null>(null)`, `hasQueried = signal(false)`, `loadingTable = signal(false)`, `loadingSummary = signal(false)`, `exporting = signal(false)`
<a id="f-comercial-jhoel-app-src-app-core-services-ice-cream-sale-draft-store-ts"></a>

### ice-cream-sale-draft.store.ts

- **Ruta:** [ice-cream-sale-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sale-draft.store.ts) (`comercial-jhoel-app/src/app/core/services/ice-cream-sale-draft.store.ts`, 116 líneas)
- **Tipo:** Store (estado) · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** The in-progress "Ventas de Heladería" receipt — same client-only draft pattern as `IceCreamPurchaseDraftStore`/`PurchaseDraftStore` rather than Ventas' server-persisted open-sale pattern: nothing is sent to the backend until "Guardar venta", which confirms the whole receipt atomically via `confirm_i
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app-update.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-app-update-service-ts), [ice-cream-sales-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts), [dashboard-sidebar.component.ts](dashboard-sidebar.md#f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts)

**Interfaces, tipos y enums:**

- `interface PersistedIceCreamSaleDraft` (L6): sin documentación — miembros: `items`

#### Clase `IceCreamSaleDraftStore` (L20–115)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** The in-progress "Ventas de Heladería" receipt — same client-only draft pattern as `IceCreamPurchaseDraftStore`/`PurchaseDraftStore` rather than Ventas' server-persisted open-sale pattern: nothing is sent to the backend until "Guardar venta", which confirms the whole receipt atomically via `confirm_ice_cream_sale` (stock is validated there, under a row lock — this store's `availableStock` is a display hint only).
- **Servicios inyectados con `inject()`:** `authService = inject(AuthService)`
- **Datos / estado que administra:** `items = signal<IceCreamSaleDraftItem[]>([])`, `total = computed(() => calculateIceCreamSaleTotal(this.ite`, `hasActiveDraft = computed(() => this.items().length > 0)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onIceCreamSelected` | método public | 33–53 | `iceCream: IceCream` | `void` |
| `updateQuantity` | método public | 56–61 | `iceCreamId: string`, `quantity: number` | `void` |
| `removeItem` | método public | 63–66 | `iceCreamId: string` | `void` |
| `reset` | método public | 68–71 | — | `void` |
| `persist` | método private | 73–85 | — | `void` |
| `restore` | método private | 87–102 | — | `void` |
| `clearStorage` | método private | 104–109 | — | `void` |
| `storageKey` | método private | 111–114 | — | `string \| null` |

##### `IceCreamSaleDraftStore.onIceCreamSelected`

- **Firma:** `onIceCreamSelected(iceCream: IceCream): void` — [ice-cream-sale-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sale-draft.store.ts#L33) (L33–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `items.find`, `items.map`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** [ice-cream-sales-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts)

##### `IceCreamSaleDraftStore.updateQuantity`

- **Firma:** `updateQuantity(iceCreamId: string, quantity: number): void` — [ice-cream-sale-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sale-draft.store.ts#L56) (L56–61)
- **Propósito / descripción:** `quantity` arrives already clamped (≥1) by the items table — this just applies it.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `items.map`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** [ice-cream-sales-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts)

##### `IceCreamSaleDraftStore.removeItem`

- **Firma:** `removeItem(iceCreamId: string): void` — [ice-cream-sale-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sale-draft.store.ts#L63) (L63–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.update`, `items.filter`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.update`
- **Consumidores:** [ice-cream-sales-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts)

##### `IceCreamSaleDraftStore.reset`

- **Firma:** `reset(): void` — [ice-cream-sale-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sale-draft.store.ts#L68) (L68–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.items.set`, `this.clearStorage`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.set`
- **Consumidores:** [ice-cream-sales-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts)

##### `IceCreamSaleDraftStore.persist`

- **Firma:** `persist(): void` — [ice-cream-sale-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sale-draft.store.ts#L73) (L73–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `this.items`, `sessionStorage.setItem`, `JSON.stringify`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `IceCreamSaleDraftStore.restore`

- **Firma:** `restore(): void` — [ice-cream-sale-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sale-draft.store.ts#L87) (L87–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `sessionStorage.getItem`, `JSON.parse`, `this.items.set`, `Array.isArray`, `sessionStorage.removeItem`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSaleDraftStore.clearStorage`

- **Firma:** `clearStorage(): void` — [ice-cream-sale-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sale-draft.store.ts#L104) (L104–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `sessionStorage.removeItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `IceCreamSaleDraftStore.storageKey`

- **Firma:** `storageKey(): string \| null` — [ice-cream-sale-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sale-draft.store.ts#L111) (L111–114)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.authService.currentUser`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-core-services-ice-cream-sales-service-ts"></a>

### ice-cream-sales.service.ts

- **Ruta:** [ice-cream-sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sales.service.ts) (`comercial-jhoel-app/src/app/core/services/ice-cream-sales.service.ts`, 30 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `IceCreamSalesService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [ice-cream-sales-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts)

#### Clase `IceCreamSalesService` (L10–29)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `createSale` | método public | 15–17 | `input: CreateIceCreamSaleInput` | `Observable<IceCreamSale>` |
| `getSales` | método public | 20–24 | — | `Observable<PaginatedResponse<IceCreamSale>>` |
| `getSaleById` | método public | 26–28 | `id: string` | `Observable<IceCreamSale>` |

##### `IceCreamSalesService.createSale`

- **Firma:** `createSale(input: CreateIceCreamSaleInput): Observable<IceCreamSale>` — [ice-cream-sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sales.service.ts#L15) (L15–17)
- **Propósito / descripción:** One atomic call — the backend's `confirm_ice_cream_sale` function creates the sale, its details, and decreases stock under a row lock (no overselling).
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<IceCreamSale>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [ice-cream-sales-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-ice-cream-sales-page-component-ts)

##### `IceCreamSalesService.getSales`

- **Firma:** `getSales(): Observable<PaginatedResponse<IceCreamSale>>` — [ice-cream-sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sales.service.ts#L20) (L20–24)
- **Propósito / descripción:** A USER account only ever gets their own sales back — the backend decides that, not this call.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PaginatedResponse<IceCreamSale>>>(BASE_URL).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamSalesService.getSaleById`

- **Firma:** `getSaleById(id: string): Observable<IceCreamSale>` — [ice-cream-sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sales.service.ts#L26) (L26–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<IceCreamSale>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-ice-cream-service-ts"></a>

### ice-cream.service.ts

- **Ruta:** [ice-cream.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream.service.ts) (`comercial-jhoel-app/src/app/core/services/ice-cream.service.ts`, 58 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `IceCreamService`, `BASE_URL`, `LIST_LIMIT`, `SEARCH_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [ice-cream-form-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-form-modal-ice-cream-form-modal-component-ts), [ice-cream-inventory-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts), [ice-cream-product-search.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-product-search-ice-cream-product-search-component-ts), [ice-cream-product-search.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-product-search-ice-cream-product-search-component-ts), [ice-cream-filter-search.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-ice-cream-filter-search-ice-cream-filter-search-component-ts)

#### Clase `IceCreamService` (L20–57)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getIceCreams` | método public | 24–28 | — | `Observable<IceCream[]>` |
| `searchIceCreams` | método public | 31–37 | `query: string` | `Observable<IceCream[]>` |
| `getIceCreamById` | método public | 39–41 | `id: string` | `Observable<IceCream>` |
| `createIceCream` | método public | 43–45 | `input: IceCreamInput` | `Observable<IceCream>` |
| `updateIceCream` | método public | 47–51 | `id: string`, `input: IceCreamInput` | `Observable<IceCream>` |
| `deleteIceCream` | método public | 54–56 | `id: string` | `Observable<void>` |

##### `IceCreamService.getIceCreams`

- **Firma:** `getIceCreams(): Observable<IceCream[]>` — [ice-cream.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream.service.ts#L24) (L24–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamService.searchIceCreams`

- **Firma:** `searchIceCreams(query: string): Observable<IceCream[]>` — [ice-cream.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream.service.ts#L31) (L31–37)
- **Propósito / descripción:** Server-side search by SKU or nombre — active helados only (the backend's default). Used by the Compras/Ventas product picker.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [ice-cream-product-search.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-product-search-ice-cream-product-search-component-ts), [ice-cream-product-search.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-product-search-ice-cream-product-search-component-ts)

##### `IceCreamService.getIceCreamById`

- **Firma:** `getIceCreamById(id: string): Observable<IceCream>` — [ice-cream.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream.service.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<IceCream>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `IceCreamService.createIceCream`

- **Firma:** `createIceCream(input: IceCreamInput): Observable<IceCream>` — [ice-cream.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream.service.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<IceCream>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [ice-cream-form-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-form-modal-ice-cream-form-modal-component-ts)

##### `IceCreamService.updateIceCream`

- **Firma:** `updateIceCream(id: string, input: IceCreamInput): Observable<IceCream>` — [ice-cream.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream.service.ts#L47) (L47–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<IceCream>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [ice-cream-form-modal.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-form-modal-ice-cream-form-modal-component-ts)

##### `IceCreamService.deleteIceCream`

- **Firma:** `deleteIceCream(id: string): Observable<void>` — [ice-cream.service.ts](../../../../comercial-jhoel-app/src/app/core/services/ice-cream.service.ts#L54) (L54–56)
- **Propósito / descripción:** Soft delete — the backend deactivates the helado, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [ice-cream-inventory-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-ice-cream-inventory-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-install-prompt-service-ts"></a>

### install-prompt.service.ts

- **Ruta:** [install-prompt.service.ts](../../../../comercial-jhoel-app/src/app/core/services/install-prompt.service.ts) (`comercial-jhoel-app/src/app/core/services/install-prompt.service.ts`, 68 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Instalación de la PWA en Android/Chrome/Edge — el equivalente de "Agregar a pantalla de inicio" de iOS, pero con una API real: estos navegadores disparan `beforeinstallprompt` apenas el sitio cumple los criterios de instalabilidad (HTTPS, manifest válido, Service Worker registrado — los tres ya exis
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [notifications-modal.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts)

**Interfaces, tipos y enums:**

- `interface BeforeInstallPromptEvent` (L7) extends Event: `beforeinstallprompt` no tiene tipos oficiales en el DOM lib de TypeScript todavía — shape mínimo real documentado por Chrome/Edge. — miembros: `prompt`, `userChoice`

#### Clase `InstallPromptService` (L25–67)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Instalación de la PWA en Android/Chrome/Edge — el equivalente de "Agregar a pantalla de inicio" de iOS, pero con una API real: estos navegadores disparan `beforeinstallprompt` apenas el sitio cumple los criterios de instalabilidad (HTTPS, manifest válido, Service Worker registrado — los tres ya existían antes de este servicio, nada nuevo que configurar), y dejan mostrar el prompt nativo bajo demanda vía `.prompt()`. Nunca necesario para recibir Push en Android (Android ya recibe Push sin instalar nada) — esto es un atajo de UX adicional, no un requisito. iOS/iPadOS Safari NUNCA dispara este evento (no lo implementa) — por eso el banner de Push sigue mostrando las instrucciones manuales solo ahí.
- **Datos / estado que administra:** `canInstall = signal(false)`, `isInstalled = signal(this.computeIsInstalled())`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `computeIsInstalled` | método private | 49–54 | — | `boolean` |
| `promptInstall` | método public async | 57–66 | — | `Promise<void>` |

##### `InstallPromptService.computeIsInstalled`

- **Firma:** `computeIsInstalled(): boolean` — [install-prompt.service.ts](../../../../comercial-jhoel-app/src/app/core/services/install-prompt.service.ts#L49) (L49–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `window.matchMedia`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InstallPromptService.promptInstall`

- **Firma:** `promptInstall(): Promise<void>` — [install-prompt.service.ts](../../../../comercial-jhoel-app/src/app/core/services/install-prompt.service.ts#L57) (L57–66)
- **Propósito / descripción:** No-op si el navegador nunca ofreció instalar (Safari, Firefox, o ya instalada) — nunca lanza.
- **Dependencias (llamadas en su cuerpo):** `this.canInstall.set`, `event.prompt`
- **Efectos secundarios:** Actualiza estado (signals): `this.canInstall.set`
- **Consumidores:** [notifications-modal.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-inventory-locations-service-ts"></a>

### inventory-locations.service.ts

- **Ruta:** [inventory-locations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts) (`comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts`, 97 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Talks to `${environment.apiUrl}/inventory` — locations, per-product presentations, the aggregated product-inventory detail view, and transfers.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [presentation-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts), [product-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts), [quick-transfer-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-quick-transfer-modal-quick-transfer-modal-component-ts), [transfer-inventory-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts), [product-detail-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-product-detail-page-component-ts), [purchase-items-table.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-items-table-purchase-items-table-component-ts)

#### Clase `InventoryLocationsService` (L24–96)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Talks to `${environment.apiUrl}/inventory` — locations, per-product presentations, the aggregated product-inventory detail view, and transfers. Named separately from `InventoryService` (which owns `/products`) since this is a distinct backend module (`modules/inventory/`) with its own resource; nothing here duplicates `InventoryService`.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getLocations` | método public | 28–32 | — | `Observable<InventoryLocation[]>` |
| `getPresentations` | método public | 34–40 | `productId: string` | `Observable<ProductPresentation[]>` |
| `createPresentation` | método public | 42–52 | `productId: string`, `input: CreatePresentationInput` | `Observable<ProductPresentation>` |
| `updatePresentation` | método public | 54–64 | `presentationId: string`, `input: UpdatePresentationInput` | `Observable<ProductPresentation>` |
| `getProductInventory` | método public | 66–72 | `productId: string` | `Observable<ProductInventoryDetail>` |
| `registerTransfer` | método public | 74–78 | `input: TransferInventoryInput` | `Observable<void>` |
| `registerTransferBatch` | método public | 81–85 | `input: TransferBatchInput` | `Observable<void>` |
| `setMinStock` | método public | 88–95 | `productId: string`, `locationId: string`, `minStock: number` | `Observable<void>` |

##### `InventoryLocationsService.getLocations`

- **Firma:** `getLocations(): Observable<InventoryLocation[]>` — [inventory-locations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts#L28) (L28–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/inventory/locations'`
- **Consumidores:** [quick-transfer-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-quick-transfer-modal-quick-transfer-modal-component-ts), [transfer-inventory-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts)

##### `InventoryLocationsService.getPresentations`

- **Firma:** `getPresentations(productId: string): Observable<ProductPresentation[]>` — [inventory-locations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts#L34) (L34–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/inventory/products/${productId}/presentations'`
- **Consumidores:** [product-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts), [purchase-items-table.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-items-table-purchase-items-table-component-ts)

##### `InventoryLocationsService.createPresentation`

- **Firma:** `createPresentation(productId: string, input: CreatePresentationInput): Observable<ProductPresentation>` — [inventory-locations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts#L42) (L42–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${environment.apiUrl}/inventory/products/${productId}/presentations'`
- **Consumidores:** [presentation-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts), [product-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts)

##### `InventoryLocationsService.updatePresentation`

- **Firma:** `updatePresentation(presentationId: string, input: UpdatePresentationInput): Observable<ProductPresentation>` — [inventory-locations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts#L54) (L54–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${environment.apiUrl}/inventory/presentations/${presentationId}'`
- **Consumidores:** [presentation-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts), [product-detail-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-product-detail-page-component-ts)

##### `InventoryLocationsService.getProductInventory`

- **Firma:** `getProductInventory(productId: string): Observable<ProductInventoryDetail>` — [inventory-locations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts#L66) (L66–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/inventory/products/${productId}'`
- **Consumidores:** [transfer-inventory-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts), [product-detail-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-product-detail-page-component-ts)

##### `InventoryLocationsService.registerTransfer`

- **Firma:** `registerTransfer(input: TransferInventoryInput): Observable<void>` — [inventory-locations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts#L74) (L74–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${environment.apiUrl}/inventory/transfers'`
- **Consumidores:** [transfer-inventory-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts)

##### `InventoryLocationsService.registerTransferBatch`

- **Firma:** `registerTransferBatch(input: TransferBatchInput): Observable<void>` — [inventory-locations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts#L81) (L81–85)
- **Propósito / descripción:** "Transferencia rápida" — mismo endpoint/stored function que `registerTransfer`, aplicado a varios productos en una sola llamada atómica.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${environment.apiUrl}/inventory/transfers/batch'`
- **Consumidores:** [quick-transfer-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-quick-transfer-modal-quick-transfer-modal-component-ts)

##### `InventoryLocationsService.setMinStock`

- **Firma:** `setMinStock(productId: string, locationId: string, minStock: number): Observable<void>` — [inventory-locations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts#L88) (L88–95)
- **Propósito / descripción:** Admin-only threshold the Alerts module reads for "inventario bajo" — `0` means "no threshold configured".
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${environment.apiUrl}/inventory/products/${productId}/locations/${locationId}/min-stock'`
- **Consumidores:** [product-detail-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-product-detail-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-inventory-service-ts"></a>

### inventory.service.ts

- **Ruta:** [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts) (`comercial-jhoel-app/src/app/core/services/inventory.service.ts`, 214 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Raw shape the API returns for a product — `category` maps this to the flat `Product` the UI uses.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [catalog-product-form-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-form-modal-catalog-product-form-modal-component-ts), [product-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts), [quick-transfer-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-quick-transfer-modal-quick-transfer-modal-component-ts), [transfer-inventory-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts), [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [purchase-product-search.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-product-search-purchase-product-search-component-ts), [quotation-product-search.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts), [product-filter-search.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-components-product-filter-search-product-filter-search-component-ts), [product-search.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-product-search-product-search-component-ts), [ticket-product-search.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-product-search-ticket-product-search-component-ts)

**Interfaces, tipos y enums:**

- `interface ProductApiModel` (L17): Raw shape the API returns for a product — `category` maps this to the flat `Product` the UI uses. — miembros: `id`, `name`, `sku`, `categoryId`, `categoryName`, `businessId`, `businessName`, `unitOfMeasureId`, `unitOfMeasureName`, `unitOfMeasureAbbreviation`, `costPrice`, `publicPrice`, `wholesalePrice`, `stock`, `stockByLocation`, `matchedPresentation`, `isActive`, `createdAt`, `updatedAt`
- `interface ProductExportFilters` (L70): Filters the export routes accept — same shape the backend's `ExportProductsQueryDto` validates. — miembros: `search`, `categoryId`, `businessId`

#### Clase `InventoryService` (L92–213)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getInventoryStats` | método public | 97–101 | — | `Observable<InventoryStats>` |
| `getProducts` | método public | 113–121 | `search?: string` | `Observable<Product[]>` |
| `searchProducts` | método public | 124–130 | `query: string` | `Observable<Product[]>` |
| `getProductById` | método public | 132–136 | `id: string` | `Observable<Product>` |
| `createProduct` | método public | 138–142 | `input: ProductInput` | `Observable<Product>` |
| `updateProduct` | método public | 145–150 | `id: string`, `input: ProductInput` | `Observable<Product>` |
| `deleteProduct` | método public | 153–155 | `id: string` | `Observable<void>` |
| `toExportParams` | método private | 170–176 | `filters: ProductExportFilters` | `Record<string, string>` |
| `exportProductsPdf` | método public | 178–183 | `filters: ProductExportFilters` | `Observable<Blob>` |
| `exportProductsExcel` | método public | 185–190 | `filters: ProductExportFilters` | `Observable<Blob>` |
| `downloadImportTemplate` | método public | 193–197 | — | `Observable<Blob>` |
| `importProductsExcel` | método public | 206–212 | `file: File` | `Observable<ImportProductsResult>` |

##### `InventoryService.getInventoryStats`

- **Firma:** `getInventoryStats(): Observable<InventoryStats>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L97) (L97–101)
- **Propósito / descripción:** Real aggregates over the whole active catalog — see `InventoryStats`'s own doc comment for why this must never be derived by summing a fetched page client-side.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/products/stats'`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts)

##### `InventoryService.getProducts`

- **Firma:** `getProducts(search?: string): Observable<Product[]>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L113) (L113–121)
- **Propósito / descripción:** `search` is optional — when provided, it's forwarded to the backend's own `search` query param (ILIKE on name/sku, already proven correct — see `searchProducts()` below) instead of relying on `limit` alone to happen to include the matching row. Without it, a catalog past `LIST_LIMIT` active products would silently exclude anything not in that first page from client-side filtering — confirmed as the real cause of "buscar un producto existente y no aparece" once the catalog grew past 200 real products.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`, `response.data.items.map`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/products'`
- **Consumidores:** [quick-transfer-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-quick-transfer-modal-quick-transfer-modal-component-ts), [transfer-inventory-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts), [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts)

##### `InventoryService.searchProducts`

- **Firma:** `searchProducts(query: string): Observable<Product[]>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L124) (L124–130)
- **Propósito / descripción:** Server-side search by name or SKU — active products only (the backend's default). Used by the Ventas product picker.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`, `response.data.items.map`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/products'`
- **Consumidores:** [purchase-product-search.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-product-search-purchase-product-search-component-ts), [quotation-product-search.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts), [product-search.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-product-search-product-search-component-ts), [ticket-product-search.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-product-search-ticket-product-search-component-ts)

##### `InventoryService.getProductById`

- **Firma:** `getProductById(id: string): Observable<Product>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L132) (L132–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`, `toProduct`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/products/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `InventoryService.createProduct`

- **Firma:** `createProduct(input: ProductInput): Observable<Product>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L138) (L138–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`, `toProduct`
- **Efectos secundarios:** HTTP: POST `'${environment.apiUrl}/products'`
- **Consumidores:** [catalog-product-form-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-form-modal-catalog-product-form-modal-component-ts), [product-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts)

##### `InventoryService.updateProduct`

- **Firma:** `updateProduct(id: string, input: ProductInput): Observable<Product>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L145) (L145–150)
- **Propósito / descripción:** `stock` is never sent here even if present on `input` — the backend rejects unknown fields on update (`forbidNonWhitelisted`), since stock is now only ever changed via Compras/Ventas/Traslados.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`, `toProduct`
- **Efectos secundarios:** HTTP: PATCH `'${environment.apiUrl}/products/${id}'`
- **Consumidores:** [catalog-product-form-modal.component.ts](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-form-modal-catalog-product-form-modal-component-ts), [product-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts)

##### `InventoryService.deleteProduct`

- **Firma:** `deleteProduct(id: string): Observable<void>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L153) (L153–155)
- **Propósito / descripción:** Soft delete — the backend deactivates the product, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${environment.apiUrl}/products/${id}'`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts)

##### `InventoryService.toExportParams`

- **Firma:** `toExportParams(filters: ProductExportFilters): Record<string, string>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L170) (L170–176)
- **Propósito / descripción:** Both exports take the same filter shape and are declared before `:id` on the backend (see `ProductsController`), exactly like Reportería's own export routes — `responseType: 'blob'` so `downloadBlob()` can trigger a real save, mirroring `ReportsService`'s export methods. Only defined filter keys are ever sent — `HttpParams` stringifies an `undefined` value as the literal text `"undefined"` instead of omitting it, which the backend's `@IsUUID()`/`@IsString()` validators would then reject with a 400 (this exact mistake was already made and fixed once in `QuotationsService.getQuotations()` — building the params object explicitly here from the start avoids repeating it).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `InventoryService.exportProductsPdf`

- **Firma:** `exportProductsPdf(filters: ProductExportFilters): Observable<Blob>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L178) (L178–183)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `this.toExportParams`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/products/export/pdf'`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts)

##### `InventoryService.exportProductsExcel`

- **Firma:** `exportProductsExcel(filters: ProductExportFilters): Observable<Blob>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L185) (L185–190)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `this.toExportParams`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/products/export/excel'`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts)

##### `InventoryService.downloadImportTemplate`

- **Firma:** `downloadImportTemplate(): Observable<Blob>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L193) (L193–197)
- **Propósito / descripción:** The blank `.xlsx` template `ImportProductsFromExcelUseCase` expects — same blob-download shape as the two exports above.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/products/import/template'`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts)

##### `InventoryService.importProductsExcel`

- **Firma:** `importProductsExcel(file: File): Observable<ImportProductsResult>` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L206) (L206–212)
- **Propósito / descripción:** `POST /products/import` — a plain JSON response (created/skipped counts), not a file, so unlike the exports this is a normal `FormData` upload with no `responseType: 'blob'`. Every row the backend accepted is already a real, saved product by the time this resolves — there's nothing further to "confirm".
- **Dependencias (llamadas en su cuerpo):** `new FormData`, `formData.append`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${environment.apiUrl}/products/import'`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts)

#### Función `toProduct` (L45–67)

- **Tipo:** función local del archivo
- **Firma:** `toProduct(api: ProductApiModel): Product` — [inventory.service.ts](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts#L45)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-keyboard-shortcut-service-ts"></a>

### keyboard-shortcut.service.ts

- **Ruta:** [keyboard-shortcut.service.ts](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcut.service.ts) (`comercial-jhoel-app/src/app/core/services/keyboard-shortcut.service.ts`, 46 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Talks to `${environment.apiUrl}/keyboard-shortcuts` — CRUD for "Sistema → Atajos de Teclado".
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [keyboard-shortcuts.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-keyboard-shortcuts-service-ts), [keyboard-shortcuts-page.component.ts](dashboard-keyboard-shortcuts.md#f-comercial-jhoel-app-src-app-features-dashboard-keyboard-shortcuts-keyboard-shortcuts-page-component-ts)

#### Clase `KeyboardShortcutService` (L14–45)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Talks to `${environment.apiUrl}/keyboard-shortcuts` — CRUD for "Sistema → Atajos de Teclado". Separate from `KeyboardShortcutsService` (the global `keydown` listener), which only ever calls `getShortcuts()` here to know what to match against.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getShortcuts` | método public | 18–26 | `includeInactive?` | `Observable<KeyboardShortcut[]>` |
| `createShortcut` | método public | 28–32 | `input: CreateKeyboardShortcutInput` | `Observable<KeyboardShortcut>` |
| `updateShortcut` | método public | 34–38 | `id: string`, `input: UpdateKeyboardShortcutInput` | `Observable<KeyboardShortcut>` |
| `deactivateShortcut` | método public | 40–44 | `id: string` | `Observable<void>` |

##### `KeyboardShortcutService.getShortcuts`

- **Firma:** `getShortcuts(includeInactive?): Observable<KeyboardShortcut[]>` — [keyboard-shortcut.service.ts](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcut.service.ts#L18) (L18–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams`, `params.set`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/keyboard-shortcuts'`
- **Consumidores:** [keyboard-shortcuts.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-keyboard-shortcuts-service-ts), [keyboard-shortcuts-page.component.ts](dashboard-keyboard-shortcuts.md#f-comercial-jhoel-app-src-app-features-dashboard-keyboard-shortcuts-keyboard-shortcuts-page-component-ts)

##### `KeyboardShortcutService.createShortcut`

- **Firma:** `createShortcut(input: CreateKeyboardShortcutInput): Observable<KeyboardShortcut>` — [keyboard-shortcut.service.ts](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcut.service.ts#L28) (L28–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${environment.apiUrl}/keyboard-shortcuts'`
- **Consumidores:** [keyboard-shortcuts-page.component.ts](dashboard-keyboard-shortcuts.md#f-comercial-jhoel-app-src-app-features-dashboard-keyboard-shortcuts-keyboard-shortcuts-page-component-ts)

##### `KeyboardShortcutService.updateShortcut`

- **Firma:** `updateShortcut(id: string, input: UpdateKeyboardShortcutInput): Observable<KeyboardShortcut>` — [keyboard-shortcut.service.ts](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcut.service.ts#L34) (L34–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${environment.apiUrl}/keyboard-shortcuts/${id}'`
- **Consumidores:** [keyboard-shortcuts-page.component.ts](dashboard-keyboard-shortcuts.md#f-comercial-jhoel-app-src-app-features-dashboard-keyboard-shortcuts-keyboard-shortcuts-page-component-ts)

##### `KeyboardShortcutService.deactivateShortcut`

- **Firma:** `deactivateShortcut(id: string): Observable<void>` — [keyboard-shortcut.service.ts](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcut.service.ts#L40) (L40–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`, `map`
- **Efectos secundarios:** HTTP: DELETE `'${environment.apiUrl}/keyboard-shortcuts/${id}'`
- **Consumidores:** [keyboard-shortcuts-page.component.ts](dashboard-keyboard-shortcuts.md#f-comercial-jhoel-app-src-app-features-dashboard-keyboard-shortcuts-keyboard-shortcuts-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-keyboard-shortcuts-service-ts"></a>

### keyboard-shortcuts.service.ts

- **Ruta:** [keyboard-shortcuts.service.ts](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcuts.service.ts) (`comercial-jhoel-app/src/app/core/services/keyboard-shortcuts.service.ts`, 121 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Global keyboard-shortcut → navigation mechanism, mirroring `FragmentScrollService`'s exact shape (root-provided singleton, one `listen()` method started once from `AppComponent`'s constructor, `takeUntilDestroyed(this.destroyRef)` for its own subscription) — not a new pattern invented for this feature.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [keyboard-shortcut.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-keyboard-shortcut-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [app.component.ts](root.md#f-comercial-jhoel-app-src-app-app-component-ts), [keyboard-shortcuts-page.component.ts](dashboard-keyboard-shortcuts.md#f-comercial-jhoel-app-src-app-features-dashboard-keyboard-shortcuts-keyboard-shortcuts-page-component-ts)

#### Clase `KeyboardShortcutsService` (L27–120)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Global keyboard-shortcut → navigation mechanism, mirroring `FragmentScrollService`'s exact shape (root-provided singleton, one `listen()` method started once from `AppComponent`'s constructor, `takeUntilDestroyed(this.destroyRef)` for its own subscription) — not a new pattern invented for this feature. The shortcut list itself is no longer a hardcoded frontend constant — it comes from `GET /keyboard-shortcuts` (`KeyboardShortcutService`), managed from "Sistema → Atajos de Teclado". This service only caches the active list in memory and matches `keydown` events against it, then calls `Router.navigateByUrl`, so every shortcut goes through the exact same guard/lazy-loading pipeline a normal link click or address-bar navigation would — there is no bypass mechanism to accidentally build here.
- **Servicios inyectados con `inject()`:** `router = inject(Router)`, `keyboardShortcutService = inject(KeyboardShortcutService)`, `confirmDialogService = inject(ConfirmDialogService)`, `destroyRef = inject(DestroyRef)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `listen` | método public | 43–54 | — | `void` |
| `refresh` | método public | 64–72 | — | `void` |
| `handleKeydown` | método private | 74–112 | `event: KeyboardEvent` | `void` |
| `isTypingTarget` | método private | 114–119 | `target: EventTarget \| null` | `boolean` |

##### `KeyboardShortcutsService.listen`

- **Firma:** `listen(): void` — [keyboard-shortcuts.service.ts](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcuts.service.ts#L43) (L43–54)
- **Propósito / descripción:** Idempotent on purpose — `AppComponent` is the only intended caller, but guarding here too means a future accidental second call (e.g. from a test bootstrapping the component twice) can never attach a second `keydown` listener.
- **Dependencias (llamadas en su cuerpo):** `this.refresh`, `fromEvent<KeyboardEvent>(document, 'keydown').pipe`, `fromEvent`, `takeUntilDestroyed`, `this.handleKeydown`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcutsService.refresh`

- **Firma:** `refresh(): void` — [keyboard-shortcuts.service.ts](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcuts.service.ts#L64) (L64–72)
- **Propósito / descripción:** Re-fetches the active shortcut list — called once on startup, and again by "Sistema → Atajos de Teclado" right after a create/update/ deactivate so a change takes effect immediately, without needing a full page reload. A failed fetch just keeps whatever list was already cached (or an empty one on first load) rather than breaking navigation elsewhere in the app.
- **Dependencias (llamadas en su cuerpo):** `this.keyboardShortcutService.getShortcuts().subscribe`, `this.keyboardShortcutService.getShortcuts`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [keyboard-shortcuts-page.component.ts](dashboard-keyboard-shortcuts.md#f-comercial-jhoel-app-src-app-features-dashboard-keyboard-shortcuts-keyboard-shortcuts-page-component-ts), (mismo archivo)

##### `KeyboardShortcutsService.handleKeydown`

- **Firma:** `handleKeydown(event: KeyboardEvent): void` — [keyboard-shortcuts.service.ts](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcuts.service.ts#L74) (L74–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.shortcuts.find`, `s.key.toLowerCase`, `event.key.toLowerCase`, `this.isTypingTarget`, `this.confirmDialogService.pending`, `document.querySelector`, `this.router.url.startsWith`, `event.preventDefault`, `this.router.navigateByUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `KeyboardShortcutsService.isTypingTarget`

- **Firma:** `isTypingTarget(target: EventTarget \| null): boolean` — [keyboard-shortcuts.service.ts](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcuts.service.ts#L114) (L114–119)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `TYPABLE_TAGS.has`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-core-services-landing-background-service-ts"></a>

### landing-background.service.ts

- **Ruta:** [landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-background.service.ts) (`comercial-jhoel-app/src/app/core/services/landing-background.service.ts`, 62 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Admin "Sistema → Fondos de Landing" — CRUD + imagen.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [background-form-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-form-modal-background-form-modal-component-ts), [background-image-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-image-modal-background-image-modal-component-ts), [background-preview-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-preview-modal-background-preview-modal-component-ts), [landing-backgrounds-page.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts)

#### Clase `LandingBackgroundService` (L11–61)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Admin "Sistema → Fondos de Landing" — CRUD + imagen. Todo el controller es admin-only en el backend.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getBackgrounds` | método public | 15–19 | `includeInactive?` | `Observable<LandingBackground[]>` |
| `getBackgroundById` | método public | 21–25 | `id: string` | `Observable<LandingBackground>` |
| `createBackground` | método public | 27–31 | `input: CreateLandingBackgroundInput` | `Observable<LandingBackground>` |
| `updateBackground` | método public | 33–37 | `id: string`, `input: UpdateLandingBackgroundInput` | `Observable<LandingBackground>` |
| `activateBackground` | método public | 39–41 | `id: string` | `Observable<void>` |
| `deactivateBackground` | método public | 44–46 | `id: string` | `Observable<void>` |
| `setImage` | método public | 48–52 | `landingBackgroundId: string`, `file: File` | `Observable<void>` |
| `removeImage` | método public | 54–56 | `landingBackgroundId: string` | `Observable<void>` |
| `getImageUrl` | método public | 58–60 | `landingBackgroundId: string` | `string` |

##### `LandingBackgroundService.getBackgrounds`

- **Firma:** `getBackgrounds(includeInactive?): Observable<LandingBackground[]>` — [landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-background.service.ts#L15) (L15–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [landing-backgrounds-page.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts)

##### `LandingBackgroundService.getBackgroundById`

- **Firma:** `getBackgroundById(id: string): Observable<LandingBackground>` — [landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-background.service.ts#L21) (L21–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<LandingBackground>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [background-image-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-image-modal-background-image-modal-component-ts)

##### `LandingBackgroundService.createBackground`

- **Firma:** `createBackground(input: CreateLandingBackgroundInput): Observable<LandingBackground>` — [landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-background.service.ts#L27) (L27–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<LandingBackground>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [background-form-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-form-modal-background-form-modal-component-ts)

##### `LandingBackgroundService.updateBackground`

- **Firma:** `updateBackground(id: string, input: UpdateLandingBackgroundInput): Observable<LandingBackground>` — [landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-background.service.ts#L33) (L33–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<LandingBackground>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [background-form-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-form-modal-background-form-modal-component-ts)

##### `LandingBackgroundService.activateBackground`

- **Firma:** `activateBackground(id: string): Observable<void>` — [landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-background.service.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/activate'`
- **Consumidores:** [landing-backgrounds-page.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts)

##### `LandingBackgroundService.deactivateBackground`

- **Firma:** `deactivateBackground(id: string): Observable<void>` — [landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-background.service.ts#L44) (L44–46)
- **Propósito / descripción:** Soft delete — el backend desactiva, nunca borra la fila (histórico preservado).
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [landing-backgrounds-page.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-landing-backgrounds-page-component-ts)

##### `LandingBackgroundService.setImage`

- **Firma:** `setImage(landingBackgroundId: string, file: File): Observable<void>` — [landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-background.service.ts#L48) (L48–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new FormData`, `formData.set`, `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${landingBackgroundId}/image'`
- **Consumidores:** [background-image-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-image-modal-background-image-modal-component-ts)

##### `LandingBackgroundService.removeImage`

- **Firma:** `removeImage(landingBackgroundId: string): Observable<void>` — [landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-background.service.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${landingBackgroundId}/image'`
- **Consumidores:** [background-image-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-image-modal-background-image-modal-component-ts)

##### `LandingBackgroundService.getImageUrl`

- **Firma:** `getImageUrl(landingBackgroundId: string): string` — [landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-background.service.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [background-form-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-form-modal-background-form-modal-component-ts), [background-image-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-image-modal-background-image-modal-component-ts), [background-preview-modal.component.ts](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-preview-modal-background-preview-modal-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-landing-quick-access-store-ts"></a>

### landing-quick-access.store.ts

- **Ruta:** [landing-quick-access.store.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-quick-access.store.ts) (`comercial-jhoel-app/src/app/core/services/landing-quick-access.store.ts`, 32 líneas)
- **Tipo:** Store (estado) · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Puente entre las secciones de catálogo y el dock de acceso rápido: cada sección publica aquí, al cargar sus datos, si tiene contenido y la URL de una imagen que ella misma ya muestra.
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [quick-access-dock.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-components-quick-access-dock-quick-access-dock-component-ts), [catalog-banks.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts), [library-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts), [phones.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts), [varieties-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts)

**Interfaces, tipos y enums:**

- `interface QuickAccessCatalogState` (L6): sin documentación — miembros: `available`, `thumbnailUrl`
- `type QuickAccessCatalogKey` (L4) = `'telefonos' \| 'libreria' \| 'variedades' \| 'bancos'` — Catálogos de la landing con acceso en el dock (ids = anclas existentes).

#### Clase `LandingQuickAccessStore` (L19–31)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Puente entre las secciones de catálogo y el dock de acceso rápido: cada sección publica aquí, al cargar sus datos, si tiene contenido y la URL de una imagen que ella misma ya muestra. Así el dock no hace ninguna petición HTTP propia ni duplica datos — solo lee lo que la sección ya tenía.
- **Datos / estado que administra:** `catalogs = signal<Record<QuickAccessCatalogKey, QuickAccessCa`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `publish` | método public | 28–30 | `key: QuickAccessCatalogKey`, `state: QuickAccessCatalogState` | `void` |

##### `LandingQuickAccessStore.publish`

- **Firma:** `publish(key: QuickAccessCatalogKey, state: QuickAccessCatalogState): void` — [landing-quick-access.store.ts](../../../../comercial-jhoel-app/src/app/core/services/landing-quick-access.store.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.catalogs.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.catalogs.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-news-subscriber-service-ts"></a>

### news-subscriber.service.ts

- **Ruta:** [news-subscriber.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-subscriber.service.ts) (`comercial-jhoel-app/src/app/core/services/news-subscriber.service.ts`, 36 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Admin "Sistema → Suscriptores de Noticias" — todo el controller es admin-only en el backend, incluidos los `GET` (expone WhatsApp/consentimiento de clientes).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [news-subscribers-page.component.ts](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-news-subscribers-page-component-ts)

#### Clase `NewsSubscriberService` (L11–35)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Admin "Sistema → Suscriptores de Noticias" — todo el controller es admin-only en el backend, incluidos los `GET` (expone WhatsApp/consentimiento de clientes). El número siempre llega ya enmascarado.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSubscribers` | método public | 15–19 | `includeInactive?` | `Observable<NewsSubscriber[]>` |
| `getSubscriberById` | método public | 21–25 | `id: string` | `Observable<NewsSubscriberDetail>` |
| `activateSubscriber` | método public | 27–29 | `id: string` | `Observable<void>` |
| `deactivateSubscriber` | método public | 32–34 | `id: string` | `Observable<void>` |

##### `NewsSubscriberService.getSubscribers`

- **Firma:** `getSubscribers(includeInactive?): Observable<NewsSubscriber[]>` — [news-subscriber.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-subscriber.service.ts#L15) (L15–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [news-subscribers-page.component.ts](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-news-subscribers-page-component-ts)

##### `NewsSubscriberService.getSubscriberById`

- **Firma:** `getSubscriberById(id: string): Observable<NewsSubscriberDetail>` — [news-subscriber.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-subscriber.service.ts#L21) (L21–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<NewsSubscriberDetail>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [news-subscribers-page.component.ts](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-news-subscribers-page-component-ts)

##### `NewsSubscriberService.activateSubscriber`

- **Firma:** `activateSubscriber(id: string): Observable<void>` — [news-subscriber.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-subscriber.service.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/activate'`
- **Consumidores:** [news-subscribers-page.component.ts](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-news-subscribers-page-component-ts)

##### `NewsSubscriberService.deactivateSubscriber`

- **Firma:** `deactivateSubscriber(id: string): Observable<void>` — [news-subscriber.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-subscriber.service.ts#L32) (L32–34)
- **Propósito / descripción:** Soft — el backend nunca borra la fila (histórico preservado).
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [news-subscribers-page.component.ts](dashboard-news-subscribers.md#f-comercial-jhoel-app-src-app-features-dashboard-news-subscribers-news-subscribers-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-news-type-service-ts"></a>

### news-type.service.ts

- **Ruta:** [news-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-type.service.ts) (`comercial-jhoel-app/src/app/core/services/news-type.service.ts`, 46 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Admin "Sistema → Tipos de Noticias" — CRUD + orden.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [news-form-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-form-modal-news-form-modal-component-ts), [news-type-form-modal.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-components-news-type-form-modal-news-type-form-modal-component-ts), [news-types-page.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-news-types-page-component-ts)

#### Clase `NewsTypeService` (L11–45)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Admin "Sistema → Tipos de Noticias" — CRUD + orden. Lectura abierta a cualquier rol autenticado (la usa el selector "Tipo de noticia" del form de Noticias); creación/edición/desactivación/orden son admin-only en el backend.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getTypes` | método public | 15–21 | `includeInactive?`, `search?: string` | `Observable<NewsType[]>` |
| `getTypeById` | método public | 23–25 | `id: string` | `Observable<NewsType>` |
| `createType` | método public | 27–29 | `input: CreateNewsTypeInput` | `Observable<NewsType>` |
| `updateType` | método public | 31–35 | `id: string`, `input: UpdateNewsTypeInput` | `Observable<NewsType>` |
| `deactivateType` | método public | 38–40 | `id: string` | `Observable<void>` |
| `reorderTypes` | método public | 42–44 | `items: { id: string; sortOrder: number }[]` | `Observable<void>` |

##### `NewsTypeService.getTypes`

- **Firma:** `getTypes(includeInactive?, search?: string): Observable<NewsType[]>` — [news-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-type.service.ts#L15) (L15–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [news-types-page.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-news-types-page-component-ts)

##### `NewsTypeService.getTypeById`

- **Firma:** `getTypeById(id: string): Observable<NewsType>` — [news-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-type.service.ts#L23) (L23–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<NewsType>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsTypeService.createType`

- **Firma:** `createType(input: CreateNewsTypeInput): Observable<NewsType>` — [news-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-type.service.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<NewsType>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [news-type-form-modal.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-components-news-type-form-modal-news-type-form-modal-component-ts)

##### `NewsTypeService.updateType`

- **Firma:** `updateType(id: string, input: UpdateNewsTypeInput): Observable<NewsType>` — [news-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-type.service.ts#L31) (L31–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<NewsType>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [news-type-form-modal.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-components-news-type-form-modal-news-type-form-modal-component-ts), [news-types-page.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-news-types-page-component-ts)

##### `NewsTypeService.deactivateType`

- **Firma:** `deactivateType(id: string): Observable<void>` — [news-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-type.service.ts#L38) (L38–40)
- **Propósito / descripción:** Soft delete — el backend desactiva, nunca borra la fila (histórico preservado).
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [news-types-page.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-news-types-page-component-ts)

##### `NewsTypeService.reorderTypes`

- **Firma:** `reorderTypes(items: { id: string; sortOrder: number }[]): Observable<void>` — [news-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news-type.service.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/reorder'`
- **Consumidores:** [news-types-page.component.ts](dashboard-news-types.md#f-comercial-jhoel-app-src-app-features-dashboard-news-types-news-types-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-news-service-ts"></a>

### news.service.ts

- **Ruta:** [news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts) (`comercial-jhoel-app/src/app/core/services/news.service.ts`, 64 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Admin "Sistema → Noticias" — CRUD + orden + imagen.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [news-form-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-form-modal-news-form-modal-component-ts), [news-image-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-image-modal-news-image-modal-component-ts), [news-page.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts)

#### Clase `NewsService` (L11–63)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Admin "Sistema → Noticias" — CRUD + orden + imagen. Todo el controller es admin-only en el backend.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getArticles` | método public | 15–21 | `includeInactive?`, `search?: string` | `Observable<NewsArticle[]>` |
| `getArticleById` | método public | 23–25 | `id: string` | `Observable<NewsArticle>` |
| `createArticle` | método public | 27–29 | `input: CreateNewsArticleInput` | `Observable<NewsArticle>` |
| `updateArticle` | método public | 31–35 | `id: string`, `input: UpdateNewsArticleInput` | `Observable<NewsArticle>` |
| `activateArticle` | método public | 37–39 | `id: string` | `Observable<void>` |
| `deactivateArticle` | método public | 42–44 | `id: string` | `Observable<void>` |
| `reorderArticles` | método public | 46–48 | `items: { id: string; sortOrder: number }[]` | `Observable<void>` |
| `setImage` | método public | 50–54 | `newsArticleId: string`, `file: File` | `Observable<void>` |
| `removeImage` | método public | 56–58 | `newsArticleId: string` | `Observable<void>` |
| `getImageUrl` | método public | 60–62 | `newsArticleId: string` | `string` |

##### `NewsService.getArticles`

- **Firma:** `getArticles(includeInactive?, search?: string): Observable<NewsArticle[]>` — [news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts#L15) (L15–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [news-page.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts)

##### `NewsService.getArticleById`

- **Firma:** `getArticleById(id: string): Observable<NewsArticle>` — [news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts#L23) (L23–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<NewsArticle>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [news-image-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-image-modal-news-image-modal-component-ts)

##### `NewsService.createArticle`

- **Firma:** `createArticle(input: CreateNewsArticleInput): Observable<NewsArticle>` — [news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<NewsArticle>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [news-form-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-form-modal-news-form-modal-component-ts)

##### `NewsService.updateArticle`

- **Firma:** `updateArticle(id: string, input: UpdateNewsArticleInput): Observable<NewsArticle>` — [news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts#L31) (L31–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<NewsArticle>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [news-form-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-form-modal-news-form-modal-component-ts)

##### `NewsService.activateArticle`

- **Firma:** `activateArticle(id: string): Observable<void>` — [news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/activate'`
- **Consumidores:** [news-page.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts)

##### `NewsService.deactivateArticle`

- **Firma:** `deactivateArticle(id: string): Observable<void>` — [news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts#L42) (L42–44)
- **Propósito / descripción:** Soft delete — el backend desactiva, nunca borra la fila (histórico preservado).
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [news-page.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts)

##### `NewsService.reorderArticles`

- **Firma:** `reorderArticles(items: { id: string; sortOrder: number }[]): Observable<void>` — [news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/reorder'`
- **Consumidores:** [news-page.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts)

##### `NewsService.setImage`

- **Firma:** `setImage(newsArticleId: string, file: File): Observable<void>` — [news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts#L50) (L50–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new FormData`, `formData.set`, `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${newsArticleId}/image'`
- **Consumidores:** [news-image-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-image-modal-news-image-modal-component-ts)

##### `NewsService.removeImage`

- **Firma:** `removeImage(newsArticleId: string): Observable<void>` — [news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts#L56) (L56–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${newsArticleId}/image'`
- **Consumidores:** [news-image-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-image-modal-news-image-modal-component-ts)

##### `NewsService.getImageUrl`

- **Firma:** `getImageUrl(newsArticleId: string): string` — [news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts#L60) (L60–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [news-image-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-image-modal-news-image-modal-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-notification-service-ts"></a>

### notification.service.ts

- **Ruta:** [notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/notification.service.ts) (`comercial-jhoel-app/src/app/core/services/notification.service.ts`, 40 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Global toast feedback — one signal list, rendered once by ToastContainerComponent in AppComponent.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [theme.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-theme-service-ts), [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [accounts-receivable-page.component.spec.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-spec-ts), [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts), [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts), [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts), [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [cuadre-agentes-page.component.spec.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-spec-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts), [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts), [banks-page.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts) y 97 más

#### Clase `NotificationService` (L9–39)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Global toast feedback — one signal list, rendered once by ToastContainerComponent in AppComponent.
- **Datos / estado que administra:** `toasts = signal<Toast[]>([])`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `success` | método public | 13–15 | `message: string` | `void` |
| `error` | método public | 17–19 | `message: string` | `void` |
| `warning` | método public | 22–24 | `message: string` | `void` |
| `info` | método public | 26–28 | `message: string` | `void` |
| `dismiss` | método public | 30–32 | `id: string` | `void` |
| `push` | método private | 34–38 | `type: ToastType`, `message: string` | `void` |

##### `NotificationService.success`

- **Firma:** `success(message: string): void` — [notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/notification.service.ts#L13) (L13–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.push`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts), [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts), [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts), [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts)

##### `NotificationService.error`

- **Firma:** `error(message: string): void` — [notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/notification.service.ts#L17) (L17–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.push`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [theme.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-theme-service-ts), [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [payment-history-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts), [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts), [assets-page.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts), [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts)

##### `NotificationService.warning`

- **Firma:** `warning(message: string): void` — [notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/notification.service.ts#L22) (L22–24)
- **Propósito / descripción:** Yellow — for cancelled/voided actions, distinct from a genuine error.
- **Dependencias (llamadas en su cuerpo):** `this.push`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts)

##### `NotificationService.info`

- **Firma:** `info(message: string): void` — [notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/notification.service.ts#L26) (L26–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.push`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [dashboard-sidebar.component.ts](dashboard-sidebar.md#f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts)

##### `NotificationService.dismiss`

- **Firma:** `dismiss(id: string): void` — [notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/notification.service.ts#L30) (L30–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.toasts.update`, `toasts.filter`
- **Efectos secundarios:** Actualiza estado (signals): `this.toasts.update`
- **Consumidores:** [toast-container.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-toast-toast-container-component-ts), (mismo archivo)

##### `NotificationService.push`

- **Firma:** `push(type: ToastType, message: string): void` — [notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/notification.service.ts#L34) (L34–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `crypto.randomUUID`, `this.toasts.update`, `setTimeout`, `this.dismiss`
- **Efectos secundarios:** Actualiza estado (signals): `this.toasts.update`
- **Consumidores:** [product-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts), [keyboard-shortcuts-page.component.ts](dashboard-keyboard-shortcuts.md#f-comercial-jhoel-app-src-app-features-dashboard-keyboard-shortcuts-keyboard-shortcuts-page-component-ts), (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-core-services-notifications-modal-service-ts"></a>

### notifications-modal.service.ts

- **Ruta:** [notifications-modal.service.ts](../../../../comercial-jhoel-app/src/app/core/services/notifications-modal.service.ts) (`comercial-jhoel-app/src/app/core/services/notifications-modal.service.ts`, 22 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Único estado "abierto/cerrado" del `NotificationsModalComponent` (el modal de Web Push que monta el Navbar una sola vez).
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [quick-access-dock.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-components-quick-access-dock-quick-access-dock-component-ts), [navbar.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts)

#### Clase `NotificationsModalService` (L10–21)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Único estado "abierto/cerrado" del `NotificationsModalComponent` (el modal de Web Push que monta el Navbar una sola vez). Existe solo para que otros accesos — p. ej. el dock de acceso rápido de la landing — abran ESE mismo modal en vez de montar un segundo. No toca nada de Web Push: SwPush, VAPID, permisos y suscripción siguen viviendo dentro del modal.
- **Datos / estado que administra:** `isOpen = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | método public | 14–16 | — | `void` |
| `close` | método public | 18–20 | — | `void` |

##### `NotificationsModalService.open`

- **Firma:** `open(): void` — [notifications-modal.service.ts](../../../../comercial-jhoel-app/src/app/core/services/notifications-modal.service.ts#L14) (L14–16)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isOpen.set`
- **Consumidores:** [quick-access-dock.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-components-quick-access-dock-quick-access-dock-component-ts), [navbar.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts)

##### `NotificationsModalService.close`

- **Firma:** `close(): void` — [notifications-modal.service.ts](../../../../comercial-jhoel-app/src/app/core/services/notifications-modal.service.ts#L18) (L18–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isOpen.set`
- **Consumidores:** [navbar.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-offers-service-ts"></a>

### offers.service.ts

- **Ruta:** [offers.service.ts](../../../../comercial-jhoel-app/src/app/core/services/offers.service.ts) (`comercial-jhoel-app/src/app/core/services/offers.service.ts`, 20 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Provides the list of services Comercial Jhoel offers (útiles escolares, fotocopias, agente bancario, etc).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [services.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-services-services-component-ts)

#### Clase `OffersService` (L14–19)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Provides the list of services Comercial Jhoel offers (útiles escolares, fotocopias, agente bancario, etc). Phase 2: replace the `of(SERVICES)` body with `this.http.get&lt;ServiceItem[]&gt;(\`${environment.apiUrl}/services\`)`.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getServices` | método public | 16–18 | — | `Observable<ServiceItem[]>` |

##### `OffersService.getServices`

- **Firma:** `getServices(): Observable<ServiceItem[]>` — [offers.service.ts](../../../../comercial-jhoel-app/src/app/core/services/offers.service.ts#L16) (L16–18)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `of`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-parallax-service-ts"></a>

### parallax.service.ts

- **Ruta:** [parallax.service.ts](../../../../comercial-jhoel-app/src/app/core/services/parallax.service.ts) (`comercial-jhoel-app/src/app/core/services/parallax.service.ts`, 67 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Single shared scroll-linked parallax engine for the whole app — ONE `window.scroll`/`resize` listener total, no matter how many decorative layers register with it (`ParallaxLayerDirective` is the consumer-facing side of this).
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts)

#### Clase `ParallaxService` (L20–66)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Single shared scroll-linked parallax engine for the whole app — ONE `window.scroll`/`resize` listener total, no matter how many decorative layers register with it (`ParallaxLayerDirective` is the consumer-facing side of this). Registering a second, third, Nth layer never adds a second listener; they all ride the same rAF-batched pass. This is what keeps this feature from becoming "a scroll listener per section," which the task explicitly asked to avoid. Only ever writes `transform` (via `translate3d`, GPU-composited, never triggers layout/paint) — never `top`/`left`/`margin`. Disabled entirely (no listener even attached) under `prefers-reduced-motion: reduce`, checked once at construction, not per-frame. También se desactiva en dispositivos táctiles/pantallas angostas (`hover: none` o &lt; 768px): en móvil el parallax cuesta más (scroll con inercia + repintado) de lo que aporta, así que esa

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `register` | método public | 38–44 | `el: HTMLElement`, `speed: number` | `void` |
| `unregister` | método public | 46–48 | `el: HTMLElement` | `void` |
| `requestUpdate` | propiedad-función private | 50–65 | — | `void` |

##### `ParallaxService.register`

- **Firma:** `register(el: HTMLElement, speed: number): void` — [parallax.service.ts](../../../../comercial-jhoel-app/src/app/core/services/parallax.service.ts#L38) (L38–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.layers.set`, `this.requestUpdate`
- **Efectos secundarios:** Actualiza estado (signals): `this.layers.set`
- **Consumidores:** [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts)

##### `ParallaxService.unregister`

- **Firma:** `unregister(el: HTMLElement): void` — [parallax.service.ts](../../../../comercial-jhoel-app/src/app/core/services/parallax.service.ts#L46) (L46–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.layers.delete`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts)

##### `ParallaxService.requestUpdate`

- **Firma:** `requestUpdate(): void` — [parallax.service.ts](../../../../comercial-jhoel-app/src/app/core/services/parallax.service.ts#L50) (L50–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `requestAnimationFrame`, `this.layers.forEach`, `el.getBoundingClientRect`, `(distanceFromCenter * speed).toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-core-services-pdf-prompt-modal-service-ts"></a>

### pdf-prompt-modal.service.ts

- **Ruta:** [pdf-prompt-modal.service.ts](../../../../comercial-jhoel-app/src/app/core/services/pdf-prompt-modal.service.ts) (`comercial-jhoel-app/src/app/core/services/pdf-prompt-modal.service.ts`, 43 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** A dedicated, small modal for the post-save "¿Generar PDF?" prompt used by Ventas/Compras — deliberately NOT built on `ConfirmDialogService`, which only ever renders exactly two buttons (Cancelar/Confirmar) and has no loading/error state of its own (by design — see its own doc comment).
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), [pdf-prompt-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-pdf-prompt-modal-pdf-prompt-modal-component-ts)

**Interfaces, tipos y enums:**

- `interface PdfPromptOptions` (L4): sin documentación — miembros: `title`, `message`, `generate`, `filename`

#### Clase `PdfPromptModalService` (L30–42)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** A dedicated, small modal for the post-save "¿Generar PDF?" prompt used by Ventas/Compras — deliberately NOT built on `ConfirmDialogService`, which only ever renders exactly two buttons (Cancelar/Confirmar) and has no loading/error state of its own (by design — see its own doc comment). This prompt needs three visible dismiss controls (X/No/Cancelar, all the same logical outcome) plus a fourth "Sí, generar PDF" action that has its own async loading/error lifecycle, so it gets its own small component instead of stretching the generic one. `prompt()` is fire-and-forget, unlike `ConfirmDialogService.confirm()` — the caller's own save flow has already fully completed by the time this modal opens (it only ever appears *after* a successful save), so there is nothing for the caller to await; the modal's own outcome (dismiss or download) is entirely self-contained.
- **Datos / estado que administra:** `pending = signal<PdfPromptOptions \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `prompt` | método public | 34–36 | `options: PdfPromptOptions` | `void` |
| `dismiss` | método public | 39–41 | — | `void` |

##### `PdfPromptModalService.prompt`

- **Firma:** `prompt(options: PdfPromptOptions): void` — [pdf-prompt-modal.service.ts](../../../../comercial-jhoel-app/src/app/core/services/pdf-prompt-modal.service.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.pending.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.pending.set`
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PdfPromptModalService.dismiss`

- **Firma:** `dismiss(): void` — [pdf-prompt-modal.service.ts](../../../../comercial-jhoel-app/src/app/core/services/pdf-prompt-modal.service.ts#L39) (L39–41)
- **Propósito / descripción:** Called by `PdfPromptModalComponent` only — closes the dialog (X/No/Cancelar or a successful download).
- **Dependencias (llamadas en su cuerpo):** `this.pending.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.pending.set`
- **Consumidores:** [pdf-prompt-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-pdf-prompt-modal-pdf-prompt-modal-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-phones-service-ts"></a>

### phones.service.ts

- **Ruta:** [phones.service.ts](../../../../comercial-jhoel-app/src/app/core/services/phones.service.ts) (`comercial-jhoel-app/src/app/core/services/phones.service.ts`, 76 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Mirrors `RechargeSimsService`'s own shape — `registerSale`/`getSaleDpiImage` follow the identical `FormData`/blob conventions documented there.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [phone-sale-detail-modal.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-components-phone-sale-detail-modal-phone-sale-detail-modal-component-ts), [phones-inventory-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts), [phones-purchase-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-purchase-phones-purchase-page-component-ts), [phones-sale-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts)

#### Clase `PhonesService` (L12–75)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Mirrors `RechargeSimsService`'s own shape — `registerSale`/`getSaleDpiImage` follow the identical `FormData`/blob conventions documented there.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `createPhone` | método public | 16–18 | `input: CreatePhoneInput` | `Observable<Phone>` |
| `getPhones` | método public | 20–22 | — | `Observable<Phone[]>` |
| `getPhoneById` | método public | 24–28 | `id: string` | `Observable<Phone>` |
| `registerSale` | método public | 35–50 | `input: RegisterPhoneSaleInput` | `Observable<PhoneSale>` |
| `getSales` | método public | 52–56 | — | `Observable<PhoneSale[]>` |
| `getSaleById` | método public | 58–62 | `id: string` | `Observable<PhoneSale>` |
| `getSaleDpiImage` | método public | 65–67 | `id: string` | `Observable<Blob>` |
| `voidSale` | método public | 70–74 | `id: string`, `reason: string` | `Observable<PhoneSale>` |

##### `PhonesService.createPhone`

- **Firma:** `createPhone(input: CreatePhoneInput): Observable<Phone>` — [phones.service.ts](../../../../comercial-jhoel-app/src/app/core/services/phones.service.ts#L16) (L16–18)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Phone>>(PHONES_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `PHONES_URL`
- **Consumidores:** [phones-purchase-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-purchase-phones-purchase-page-component-ts)

##### `PhonesService.getPhones`

- **Firma:** `getPhones(): Observable<Phone[]>` — [phones.service.ts](../../../../comercial-jhoel-app/src/app/core/services/phones.service.ts#L20) (L20–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Phone[]>>(PHONES_URL).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `PHONES_URL`
- **Consumidores:** [phones-inventory-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts), [phones-sale-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts)

##### `PhonesService.getPhoneById`

- **Firma:** `getPhoneById(id: string): Observable<Phone>` — [phones.service.ts](../../../../comercial-jhoel-app/src/app/core/services/phones.service.ts#L24) (L24–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Phone>>('${PHONES_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${PHONES_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhonesService.registerSale`

- **Firma:** `registerSale(input: RegisterPhoneSaleInput): Observable<PhoneSale>` — [phones.service.ts](../../../../comercial-jhoel-app/src/app/core/services/phones.service.ts#L35) (L35–50)
- **Propósito / descripción:** `FormData`, not JSON — `dpiImage` (when present) is a real file. Angular's `HttpClient` sets the correct `multipart/form-data` boundary automatically for a `FormData` body — never set `Content-Type` manually here.
- **Dependencias (llamadas en su cuerpo):** `new FormData`, `formData.set`, `this.http.post<ApiSuccessResponse<PhoneSale>>(PHONE_SALES_URL, formData).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `PHONE_SALES_URL`
- **Consumidores:** [phones-sale-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts)

##### `PhonesService.getSales`

- **Firma:** `getSales(): Observable<PhoneSale[]>` — [phones.service.ts](../../../../comercial-jhoel-app/src/app/core/services/phones.service.ts#L52) (L52–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PhoneSale[]>>(PHONE_SALES_URL).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `PHONE_SALES_URL`
- **Consumidores:** [phones-inventory-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-phones-inventory-page-component-ts), [phones-sale-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts)

##### `PhonesService.getSaleById`

- **Firma:** `getSaleById(id: string): Observable<PhoneSale>` — [phones.service.ts](../../../../comercial-jhoel-app/src/app/core/services/phones.service.ts#L58) (L58–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PhoneSale>>('${PHONE_SALES_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${PHONE_SALES_URL}/${id}'`
- **Consumidores:** [phone-sale-detail-modal.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-components-phone-sale-detail-modal-phone-sale-detail-modal-component-ts)

##### `PhonesService.getSaleDpiImage`

- **Firma:** `getSaleDpiImage(id: string): Observable<Blob>` — [phones.service.ts](../../../../comercial-jhoel-app/src/app/core/services/phones.service.ts#L65) (L65–67)
- **Propósito / descripción:** Fetched as a `Blob`, never a direct `&lt;img [src]&gt;` URL — the endpoint requires a JWT a bare `&lt;img src&gt;` can never send.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`
- **Efectos secundarios:** HTTP: GET `'${PHONE_SALES_URL}/${id}/dpi-image'`
- **Consumidores:** [phone-sale-detail-modal.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-components-phone-sale-detail-modal-phone-sale-detail-modal-component-ts)

##### `PhonesService.voidSale`

- **Firma:** `voidSale(id: string, reason: string): Observable<PhoneSale>` — [phones.service.ts](../../../../comercial-jhoel-app/src/app/core/services/phones.service.ts#L70) (L70–74)
- **Propósito / descripción:** Admin-only server-side; never a physical delete/edit — restores the phone to `DISPONIBLE`.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${PHONE_SALES_URL}/${id}/void'`
- **Consumidores:** [phones-sale-page.component.ts](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-sale-phones-sale-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-presentation-type-service-ts"></a>

### presentation-type.service.ts

- **Ruta:** [presentation-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/presentation-type.service.ts) (`comercial-jhoel-app/src/app/core/services/presentation-type.service.ts`, 69 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `PresentationTypeService`, `toParams`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [presentation-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts), [product-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts), [presentation-types-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-presentation-types-tab-presentation-types-tab-component-ts)

#### Clase `PresentationTypeService` (L27–68)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getPresentationTypes` | método public | 31–39 | `filters?: PresentationTypeFilters` | `Observable<PresentationTypeListItem[]>` |
| `getPresentationTypeById` | método public | 41–45 | `id: string` | `Observable<PresentationType>` |
| `createPresentationType` | método public | 47–53 | `input: PresentationTypeInput` | `Observable<PresentationType>` |
| `updatePresentationType` | método public | 55–62 | `id: string`, `input: Partial<PresentationTypeInput>` | `Observable<PresentationType>` |
| `deletePresentationType` | método public | 65–67 | `id: string` | `Observable<void>` |

##### `PresentationTypeService.getPresentationTypes`

- **Firma:** `getPresentationTypes(filters?: PresentationTypeFilters): Observable<PresentationTypeListItem[]>` — [presentation-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/presentation-type.service.ts#L31) (L31–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [presentation-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts), [product-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts), [presentation-types-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-presentation-types-tab-presentation-types-tab-component-ts)

##### `PresentationTypeService.getPresentationTypeById`

- **Firma:** `getPresentationTypeById(id: string): Observable<PresentationType>` — [presentation-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/presentation-type.service.ts#L41) (L41–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PresentationType>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PresentationTypeService.createPresentationType`

- **Firma:** `createPresentationType(input: PresentationTypeInput): Observable<PresentationType>` — [presentation-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/presentation-type.service.ts#L47) (L47–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<PresentationType>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [presentation-types-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-presentation-types-tab-presentation-types-tab-component-ts)

##### `PresentationTypeService.updatePresentationType`

- **Firma:** `updatePresentationType(id: string, input: Partial<PresentationTypeInput>): Observable<PresentationType>` — [presentation-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/presentation-type.service.ts#L55) (L55–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<PresentationType>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [presentation-types-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-presentation-types-tab-presentation-types-tab-component-ts)

##### `PresentationTypeService.deletePresentationType`

- **Firma:** `deletePresentationType(id: string): Observable<void>` — [presentation-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/presentation-type.service.ts#L65) (L65–67)
- **Propósito / descripción:** Soft delete — the backend deactivates the row, it never deletes it.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [presentation-types-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-presentation-types-tab-presentation-types-tab-component-ts)

#### Función `toParams` (L16–25)

- **Tipo:** función local del archivo
- **Firma:** `toParams(filters: PresentationTypeFilters): HttpParams` — [presentation-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/presentation-type.service.ts#L16)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new HttpParams`, `params.set`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-public-catalog-bank-service-ts"></a>

### public-catalog-bank.service.ts

- **Ruta:** [public-catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-catalog-bank.service.ts) (`comercial-jhoel-app/src/app/core/services/public-catalog-bank.service.ts`, 25 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Público, sin autenticación — backs "Bancos" en la landing.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [catalog-banks.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts), [bank-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-card-bank-card-component-ts)

#### Clase `PublicCatalogBankService` (L11–24)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Público, sin autenticación — backs "Bancos" en la landing.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getPublishedBanks` | método public | 15–19 | — | `Observable<PublicCatalogBank[]>` |
| `getImageUrl` | método public | 21–23 | `catalogBankId: string` | `string` |

##### `PublicCatalogBankService.getPublishedBanks`

- **Firma:** `getPublishedBanks(): Observable<PublicCatalogBank[]>` — [public-catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-catalog-bank.service.ts#L15) (L15–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PublicCatalogBank[]>>(BASE_URL).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicCatalogBankService.getImageUrl`

- **Firma:** `getImageUrl(catalogBankId: string): string` — [public-catalog-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-catalog-bank.service.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-public-catalog-service-ts"></a>

### public-catalog.service.ts

- **Ruta:** [public-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-catalog.service.ts) (`comercial-jhoel-app/src/app/core/services/public-catalog.service.ts`, 62 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Público, sin autenticación — backs la sección "Teléfonos" de la landing y el modal de interés.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [visitor-id.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-visitor-id-util-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [phone-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-card-phone-card-component-ts), [phone-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-interest-modal-phone-interest-modal-component-ts), [phones.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts)

#### Clase `PublicCatalogService` (L12–61)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Público, sin autenticación — backs la sección "Teléfonos" de la landing y el modal de interés. Mismo `apiUrl`, el interceptor de auth simplemente no encuentra token que adjuntar.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getPublishedPhones` | método public | 16–22 | — | `Observable<PublicCatalogPhone[]>` |
| `getPhoneById` | método public | 24–30 | `id: string` | `Observable<PublicCatalogPhone>` |
| `getImageUrl` | método public | 32–34 | `imageId: string` | `string` |
| `createRequest` | método public | 36–40 | `payload: CreateCatalogRequestPayload` | `Observable<CatalogRequest>` |
| `likePhone` | método public | 42–50 | `id: string` | `Observable<{ likesCount: number; liked: boolean }>` |
| `unlikePhone` | método public | 52–60 | `id: string` | `Observable<{ likesCount: number; liked: boolean }>` |

##### `PublicCatalogService.getPublishedPhones`

- **Firma:** `getPublishedPhones(): Observable<PublicCatalogPhone[]>` — [public-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-catalog.service.ts#L16) (L16–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/phones'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicCatalogService.getPhoneById`

- **Firma:** `getPhoneById(id: string): Observable<PublicCatalogPhone>` — [public-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-catalog.service.ts#L24) (L24–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/phones/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicCatalogService.getImageUrl`

- **Firma:** `getImageUrl(imageId: string): string` — [public-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-catalog.service.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicCatalogService.createRequest`

- **Firma:** `createRequest(payload: CreateCatalogRequestPayload): Observable<CatalogRequest>` — [public-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-catalog.service.ts#L36) (L36–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<CatalogRequest>>('${BASE_URL}/requests', payload).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/requests'`
- **Consumidores:** [phone-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-interest-modal-phone-interest-modal-component-ts)

##### `PublicCatalogService.likePhone`

- **Firma:** `likePhone(id: string): Observable<{ likesCount: number; liked: boolean }>` — [public-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-catalog.service.ts#L42) (L42–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/phones/${id}/like'`
- **Consumidores:** [phone-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-card-phone-card-component-ts)

##### `PublicCatalogService.unlikePhone`

- **Firma:** `unlikePhone(id: string): Observable<{ likesCount: number; liked: boolean }>` — [public-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-catalog.service.ts#L52) (L52–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/phones/${id}/unlike'`
- **Consumidores:** [phone-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-card-phone-card-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-public-landing-background-service-ts"></a>

### public-landing-background.service.ts

- **Ruta:** [public-landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-landing-background.service.ts) (`comercial-jhoel-app/src/app/core/services/public-landing-background.service.ts`, 38 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Público, sin autenticación — backs la capa de fondos 3D de la landing.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts)

#### Clase `PublicLandingBackgroundService` (L17–37)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Público, sin autenticación — backs la capa de fondos 3D de la landing. `getPublishedBackgrounds()` se cachea (`shareReplay(1)`) porque las 9 secciones de la landing la consultan independientemente vía `SectionLandingBackgroundComponent` — sin esto serían 9 peticiones HTTP idénticas en cada carga; con esto es siempre una sola, compartida.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getPublishedBackgrounds` | método public | 22–32 | — | `Observable<PublicLandingBackground[]>` |
| `getImageUrl` | método public | 34–36 | `landingBackgroundId: string` | `string` |

##### `PublicLandingBackgroundService.getPublishedBackgrounds`

- **Firma:** `getPublishedBackgrounds(): Observable<PublicLandingBackground[]>` — [public-landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-landing-background.service.ts#L22) (L22–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PublicLandingBackground[]>>(BASE_URL).pipe`, `this.http.get`, `map`, `shareReplay`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicLandingBackgroundService.getImageUrl`

- **Firma:** `getImageUrl(landingBackgroundId: string): string` — [public-landing-background.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-landing-background.service.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-public-news-subscription-service-ts"></a>

### public-news-subscription.service.ts

- **Ruta:** [public-news-subscription.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts) (`comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts`, 72 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Público, sin autenticación — backs la sección "Recibe nuestras noticias por WhatsApp" de la landing, el banner de notificaciones push (`PushNotificationService`), y la página de autoservicio de preferencias (`/noticias/preferencias/:token`).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [push-notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-push-notification-service-ts), [news-preferences-page.component.ts](news-preferences.md#f-comercial-jhoel-app-src-app-features-news-preferences-news-preferences-page-component-ts), [notifications-modal.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts)

#### Clase `PublicNewsSubscriptionService` (L23–71)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Público, sin autenticación — backs la sección "Recibe nuestras noticias por WhatsApp" de la landing, el banner de notificaciones push (`PushNotificationService`), y la página de autoservicio de preferencias (`/noticias/preferencias/:token`). `token` nunca es el número de WhatsApp — es el `manageToken` opaco devuelto al suscribirse.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getActiveTypes` | método public | 27–31 | — | `Observable<PublicNewsType[]>` |
| `subscribe` | método public | 33–37 | `input: SubscribeToNewsInput` | `Observable<Subscription>` |
| `getByToken` | método public | 39–43 | `token: string` | `Observable<Subscription>` |
| `updatePreferences` | método public | 45–49 | `token: string`, `typeIds: string[]` | `Observable<Subscription>` |
| `unsubscribe` | método public | 51–53 | `token: string` | `Observable<void>` |
| `getVapidPublicKey` | método public | 56–60 | — | `Observable<string \| null>` |
| `registerPush` | método public | 62–66 | `input: RegisterPushSubscriptionInput` | `Observable<Subscription>` |
| `unregisterPush` | método public | 68–70 | `endpoint: string` | `Observable<void>` |

##### `PublicNewsSubscriptionService.getActiveTypes`

- **Firma:** `getActiveTypes(): Observable<PublicNewsType[]>` — [public-news-subscription.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts#L27) (L27–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PublicNewsType[]>>('${BASE_URL}/types').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/types'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsSubscriptionService.subscribe`

- **Firma:** `subscribe(input: SubscribeToNewsInput): Observable<Subscription>` — [public-news-subscription.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts#L33) (L33–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Subscription>>('${BASE_URL}/subscribe', input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/subscribe'`
- **Consumidores:** [news-preferences-page.component.ts](news-preferences.md#f-comercial-jhoel-app-src-app-features-news-preferences-news-preferences-page-component-ts), [notifications-modal.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts)

##### `PublicNewsSubscriptionService.getByToken`

- **Firma:** `getByToken(token: string): Observable<Subscription>` — [public-news-subscription.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts#L39) (L39–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Subscription>>('${BASE_URL}/${token}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${token}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsSubscriptionService.updatePreferences`

- **Firma:** `updatePreferences(token: string, typeIds: string[]): Observable<Subscription>` — [public-news-subscription.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts#L45) (L45–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${token}'`
- **Consumidores:** [news-preferences-page.component.ts](news-preferences.md#f-comercial-jhoel-app-src-app-features-news-preferences-news-preferences-page-component-ts)

##### `PublicNewsSubscriptionService.unsubscribe`

- **Firma:** `unsubscribe(token: string): Observable<void>` — [public-news-subscription.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${token}/unsubscribe'`
- **Consumidores:** [push-notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-push-notification-service-ts), [news-preferences-page.component.ts](news-preferences.md#f-comercial-jhoel-app-src-app-features-news-preferences-news-preferences-page-component-ts), [notifications-modal.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts)

##### `PublicNewsSubscriptionService.getVapidPublicKey`

- **Firma:** `getVapidPublicKey(): Observable<string \| null>` — [public-news-subscription.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts#L56) (L56–60)
- **Propósito / descripción:** Clave pública VAPID — no es secreta, `SwPush.requestSubscription` la necesita. `null` si el backend aún no la tiene configurada.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/push/vapid-public-key'`
- **Consumidores:** [push-notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-push-notification-service-ts)

##### `PublicNewsSubscriptionService.registerPush`

- **Firma:** `registerPush(input: RegisterPushSubscriptionInput): Observable<Subscription>` — [public-news-subscription.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts#L62) (L62–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/push/subscribe'`
- **Consumidores:** [push-notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-push-notification-service-ts)

##### `PublicNewsSubscriptionService.unregisterPush`

- **Firma:** `unregisterPush(endpoint: string): Observable<void>` — [public-news-subscription.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/push/unsubscribe'`
- **Consumidores:** [push-notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-push-notification-service-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-public-news-service-ts"></a>

### public-news.service.ts

- **Ruta:** [public-news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news.service.ts) (`comercial-jhoel-app/src/app/core/services/public-news.service.ts`, 65 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Público, sin autenticación — backs "Noticias" en la landing.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [visitor-id.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-visitor-id-util-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [news-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-card-news-card-component-ts), [news-detail-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-detail-modal-news-detail-modal-component-ts), [news.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts), [news-detail-page.component.ts](news-detail.md#f-comercial-jhoel-app-src-app-features-news-detail-news-detail-page-component-ts)

#### Clase `PublicNewsService` (L12–64)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Público, sin autenticación — backs "Noticias" en la landing.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getPublishedArticles` | método public | 16–22 | — | `Observable<PublicNewsArticle[]>` |
| `getArticleById` | método public | 24–30 | `id: string` | `Observable<PublicNewsArticle>` |
| `getArticleBySlug` | método public | 33–39 | `slug: string` | `Observable<PublicNewsArticle>` |
| `getImageUrl` | método public | 41–43 | `newsArticleId: string` | `string` |
| `likeArticle` | método public | 45–53 | `id: string` | `Observable<{ likesCount: number; liked: boolean }>` |
| `unlikeArticle` | método public | 55–63 | `id: string` | `Observable<{ likesCount: number; liked: boolean }>` |

##### `PublicNewsService.getPublishedArticles`

- **Firma:** `getPublishedArticles(): Observable<PublicNewsArticle[]>` — [public-news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news.service.ts#L16) (L16–22)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsService.getArticleById`

- **Firma:** `getArticleById(id: string): Observable<PublicNewsArticle>` — [public-news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news.service.ts#L24) (L24–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsService.getArticleBySlug`

- **Firma:** `getArticleBySlug(slug: string): Observable<PublicNewsArticle>` — [public-news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news.service.ts#L33) (L33–39)
- **Propósito / descripción:** Backs la URL pública real `/noticias/:slug` — la que se manda en el mensaje de WhatsApp.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/by-slug/${slug}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsService.getImageUrl`

- **Firma:** `getImageUrl(newsArticleId: string): string` — [public-news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news.service.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsService.likeArticle`

- **Firma:** `likeArticle(id: string): Observable<{ likesCount: number; liked: boolean }>` — [public-news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news.service.ts#L45) (L45–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/like'`
- **Consumidores:** [news-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-card-news-card-component-ts)

##### `PublicNewsService.unlikeArticle`

- **Firma:** `unlikeArticle(id: string): Observable<{ likesCount: number; liked: boolean }>` — [public-news.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-news.service.ts#L55) (L55–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/unlike'`
- **Consumidores:** [news-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-card-news-card-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-public-product-catalog-service-ts"></a>

### public-product-catalog.service.ts

- **Ruta:** [public-product-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-product-catalog.service.ts) (`comercial-jhoel-app/src/app/core/services/public-product-catalog.service.ts`, 69 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Público, sin autenticación — backs "Librería" y "Variedades y Accesorios" en la landing, y el modal "Lo quiero" de Variedades.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [visitor-id.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-visitor-id-util-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [library-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts), [catalog-product-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-card-catalog-product-card-component-ts), [product-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-components-product-interest-modal-product-interest-modal-component-ts), [varieties-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts)

#### Clase `PublicProductCatalogService` (L18–68)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Público, sin autenticación — backs "Librería" y "Variedades y Accesorios" en la landing, y el modal "Lo quiero" de Variedades.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getPublishedProducts` | método public | 22–29 | `section: CatalogProductSection` | `Observable<PublicCatalogProduct[]>` |
| `getProductById` | método public | 31–37 | `id: string` | `Observable<PublicCatalogProduct>` |
| `getImageUrl` | método public | 39–41 | `catalogProductId: string` | `string` |
| `createRequest` | método public | 43–47 | `payload: CreateCatalogProductRequestPayload` | `Observable<CatalogProductRequest>` |
| `likeProduct` | método public | 49–57 | `id: string` | `Observable<{ likesCount: number; liked: boolean }>` |
| `unlikeProduct` | método public | 59–67 | `id: string` | `Observable<{ likesCount: number; liked: boolean }>` |

##### `PublicProductCatalogService.getPublishedProducts`

- **Firma:** `getPublishedProducts(section: CatalogProductSection): Observable<PublicCatalogProduct[]>` — [public-product-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-product-catalog.service.ts#L22) (L22–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/products'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicProductCatalogService.getProductById`

- **Firma:** `getProductById(id: string): Observable<PublicCatalogProduct>` — [public-product-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-product-catalog.service.ts#L31) (L31–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/products/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicProductCatalogService.getImageUrl`

- **Firma:** `getImageUrl(catalogProductId: string): string` — [public-product-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-product-catalog.service.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicProductCatalogService.createRequest`

- **Firma:** `createRequest(payload: CreateCatalogProductRequestPayload): Observable<CatalogProductRequest>` — [public-product-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-product-catalog.service.ts#L43) (L43–47)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/product-requests'`
- **Consumidores:** [product-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-components-product-interest-modal-product-interest-modal-component-ts)

##### `PublicProductCatalogService.likeProduct`

- **Firma:** `likeProduct(id: string): Observable<{ likesCount: number; liked: boolean }>` — [public-product-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-product-catalog.service.ts#L49) (L49–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/products/${id}/like'`
- **Consumidores:** [catalog-product-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-card-catalog-product-card-component-ts)

##### `PublicProductCatalogService.unlikeProduct`

- **Firma:** `unlikeProduct(id: string): Observable<{ likesCount: number; liked: boolean }>` — [public-product-catalog.service.ts](../../../../comercial-jhoel-app/src/app/core/services/public-product-catalog.service.ts#L59) (L59–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `getVisitorId`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/products/${id}/unlike'`
- **Consumidores:** [catalog-product-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-card-catalog-product-card-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-purchase-draft-store-ts"></a>

### purchase-draft.store.ts

- **Ruta:** [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts) (`comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts`, 338 líneas)
- **Tipo:** Store (estado) · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** The in-progress "Compras" invoice(s), lifted out of `PurchasesPageComponent` into a root-provided singleton so it survives route navigation — Angular never destroys a `providedIn: 'root'` service just because its consuming component unmounts, only a full page reload does that.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [app-update.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-app-update-service-ts), [dashboard-layout.component.ts](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts), [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), [dashboard-sidebar.component.ts](dashboard-sidebar.md#f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts)

**Interfaces, tipos y enums:**

- `interface PurchaseDraft` (L23): One in-progress "Compra" — everything `PurchasesPageComponent`'s form/table/summary needs, independent of any other open tab. — miembros: `id`, `supplierId`, `purchaseDate`, `items`, `paymentType`, `paymentDueDate`, `invoiceNumber`
- `interface PersistedPurchaseDrafts` (L47): sin documentación — miembros: `drafts`, `activeDraftId`

#### Clase `PurchaseDraftStore` (L81–337)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** The in-progress "Compras" invoice(s), lifted out of `PurchasesPageComponent` into a root-provided singleton so it survives route navigation — Angular never destroys a `providedIn: 'root'` service just because its consuming component unmounts, only a full page reload does that. Unlike Ventas, Compras has no server-side draft to refetch (see `PurchaseDraftItem`'s own doc comment — nothing is sent to the backend until "Guardar compra"), so this store is the *only* place any in-progress invoice lives. **Multiple simultaneous drafts (tabs)**: `drafts` holds every open Compra, `activeDraftId` picks which one the page currently shows/edits — this is what lets a cashier register several unrelated invoices side by side (e.g. one per supplier) without losing progress on the others. There is always at least one draft; `closeDraft()` on the last remaining one replaces it with a fresh blank draft rat
- **Servicios inyectados con `inject()`:** `authService = inject(AuthService)`
- **Datos / estado que administra:** `drafts = signal<PurchaseDraft[]>([makeBlankDraft()])`, `activeDraftId = signal<string>(this.drafts()[0].id)`, `activeDraft = computed( () => this.drafts().find((d) => d.id ===`, `supplierId = computed(() => this.activeDraft().supplierId)`, `purchaseDate = computed(() => this.activeDraft().purchaseDate)`, `items = computed(() => this.activeDraft().items)`, `paymentType = computed(() => this.activeDraft().paymentType)`, `paymentDueDate = computed(() => this.activeDraft().paymentDueDate)`, `invoiceNumber = computed(() => this.activeDraft().invoiceNumber)`, `total = computed(() => calculatePurchaseTotal(this.activeD`, `hasActiveDraft = computed(() => this.drafts().some((d) => d.items.l`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `draftTotal` | método public | 111–113 | `draft: PurchaseDraft` | `number` |
| `openNewDraft` | método public | 115–120 | — | `void` |
| `setActiveDraft` | método public | 122–126 | `id: string` | `void` |
| `closeDraft` | método public | 134–142 | `id: string` | `void` |
| `updateActiveDraft` | método private | 144–148 | `updater: (draft: PurchaseDraft) => PurchaseDraft` | `void` |
| `onProductSelected` | método public | 150–180 | `product: Product` | `void` |
| `updateQuantity` | método public | 183–188 | `productId: string`, `quantity: number` | `void` |
| `updateCostPrice` | método public | 190–195 | `productId: string`, `costPrice: number` | `void` |
| `updatePublicPrice` | método public | 197–202 | `productId: string`, `publicPrice: number` | `void` |
| `updatePresentation` | método public | 212–227 | `productId: string`, `presentation: ProductPresentation \| null` | `void` |
| `removeItem` | método public | 229–234 | `productId: string` | `void` |
| `setSupplier` | método public | 236–238 | `supplierId: string` | `void` |
| `setPurchaseDate` | método public | 240–242 | `date: string` | `void` |
| `setPaymentType` | método public | 244–250 | `paymentType: PurchasePaymentType` | `void` |
| `setPaymentDueDate` | método public | 252–254 | `date: string` | `void` |
| `setInvoiceNumber` | método public | 256–258 | `invoiceNumber: string` | `void` |
| `resetActiveDraft` | método public | 267–269 | — | `void` |
| `reset` | método public | 277–282 | — | `void` |
| `persist` | método private | 284–300 | — | `void` |
| `restore` | método private | 302–323 | — | `void` |
| `clearStorage` | método private | 325–330 | — | `void` |
| `storageKey` | método private | 333–336 | — | `string \| null` |

##### `PurchaseDraftStore.draftTotal`

- **Firma:** `draftTotal(draft: PurchaseDraft): number` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L111) (L111–113)
- **Propósito / descripción:** Total for a specific tab — used by the tab bar to label/badge a non-active draft without switching to it first.
- **Dependencias (llamadas en su cuerpo):** `calculatePurchaseTotal`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDraftStore.openNewDraft`

- **Firma:** `openNewDraft(): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L115) (L115–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `makeBlankDraft`, `this.drafts.update`, `this.activeDraftId.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.drafts.update`, `this.activeDraftId.set`
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.setActiveDraft`

- **Firma:** `setActiveDraft(id: string): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L122) (L122–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.drafts().some`, `this.drafts`, `this.activeDraftId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeDraftId.set`
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.closeDraft`

- **Firma:** `closeDraft(id: string): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L134) (L134–142)
- **Propósito / descripción:** Closes one tab — used both for an explicit "×" on a tab and (via `PurchasesPageComponent`) after a confirmed save or cancel of whichever draft was active. Never leaves zero tabs: closing the last remaining draft replaces it with a fresh blank one instead of emptying the array.
- **Dependencias (llamadas en su cuerpo):** `this.drafts().filter`, `this.drafts`, `makeBlankDraft`, `this.drafts.set`, `nextDrafts.some`, `this.activeDraftId`, `this.activeDraftId.set`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.drafts.set`, `this.activeDraftId.set`
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), (mismo archivo)

##### `PurchaseDraftStore.updateActiveDraft`

- **Firma:** `updateActiveDraft(updater: (draft: PurchaseDraft) => PurchaseDraft): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L144) (L144–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.activeDraftId`, `this.drafts.update`, `drafts.map`, `updater`, `this.persist`
- **Efectos secundarios:** Actualiza estado (signals): `this.drafts.update`
- **Consumidores:** (mismo archivo)

##### `PurchaseDraftStore.onProductSelected`

- **Firma:** `onProductSelected(product: Product): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L150) (L150–180)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateActiveDraft`, `draft.items.find`, `draft.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.updateQuantity`

- **Firma:** `updateQuantity(productId: string, quantity: number): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L183) (L183–188)
- **Propósito / descripción:** `quantity` arrives already clamped (≥1) by `PurchaseItemsTableComponent` — this just applies it.
- **Dependencias (llamadas en su cuerpo):** `this.updateActiveDraft`, `draft.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.updateCostPrice`

- **Firma:** `updateCostPrice(productId: string, costPrice: number): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L190) (L190–195)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateActiveDraft`, `draft.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.updatePublicPrice`

- **Firma:** `updatePublicPrice(productId: string, publicPrice: number): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L197) (L197–202)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateActiveDraft`, `draft.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.updatePresentation`

- **Firma:** `updatePresentation(productId: string, presentation: ProductPresentation \| null): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L212) (L212–227)
- **Propósito / descripción:** `null` = back to the implicit base "Unidad". Also resets `costPrice`/ `publicPrice` to the chosen presentation's own prices (or the product's base prices for "Unidad") — presentations price independently (e.g. Q12/caja, not `precio_unidad × 12`), so switching presentation without updating price would silently keep whatever the previous presentation's price happened to be.
- **Dependencias (llamadas en su cuerpo):** `this.updateActiveDraft`, `draft.items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.removeItem`

- **Firma:** `removeItem(productId: string): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L229) (L229–234)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateActiveDraft`, `draft.items.filter`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.setSupplier`

- **Firma:** `setSupplier(supplierId: string): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L236) (L236–238)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateActiveDraft`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.setPurchaseDate`

- **Firma:** `setPurchaseDate(date: string): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L240) (L240–242)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateActiveDraft`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.setPaymentType`

- **Firma:** `setPaymentType(paymentType: PurchasePaymentType): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L244) (L244–250)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateActiveDraft`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.setPaymentDueDate`

- **Firma:** `setPaymentDueDate(date: string): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L252) (L252–254)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateActiveDraft`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchaseDraftStore.setInvoiceNumber`

- **Firma:** `setInvoiceNumber(invoiceNumber: string): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L256) (L256–258)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateActiveDraft`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDraftStore.resetActiveDraft`

- **Firma:** `resetActiveDraft(): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L267) (L267–269)
- **Propósito / descripción:** Clears whichever draft is active — called after a confirmed save or a confirmed cancel. Delegates to `closeDraft()`: if other tabs are still open, the active one simply disappears and another tab becomes active; if it was the only tab, it's replaced by a fresh blank draft so the page never ends up with nothing to show.
- **Dependencias (llamadas en su cuerpo):** `this.closeDraft`, `this.activeDraftId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDraftStore.reset`

- **Firma:** `reset(): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L277) (L277–282)
- **Propósito / descripción:** Full wipe — every open tab, not just the active one. Only sanctioned use is logout: an in-progress Compra shouldn't survive a different account logging in on the same browser tab. Wipes both the in-memory signals and the persisted `sessionStorage` entry.
- **Dependencias (llamadas en su cuerpo):** `makeBlankDraft`, `this.drafts.set`, `this.activeDraftId.set`, `this.clearStorage`
- **Efectos secundarios:** Actualiza estado (signals): `this.drafts.set`, `this.activeDraftId.set`
- **Consumidores:** [dashboard-layout.component.ts](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts)

##### `PurchaseDraftStore.persist`

- **Firma:** `persist(): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L284) (L284–300)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `this.drafts`, `this.activeDraftId`, `sessionStorage.setItem`, `JSON.stringify`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `PurchaseDraftStore.restore`

- **Firma:** `restore(): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L302) (L302–323)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `sessionStorage.getItem`, `JSON.parse`, `Array.isArray`, `makeBlankDraft`, `this.drafts.set`, `drafts.some`, `this.activeDraftId.set`, `sessionStorage.removeItem`
- **Efectos secundarios:** Actualiza estado (signals): `this.drafts.set`, `this.activeDraftId.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PurchaseDraftStore.clearStorage`

- **Firma:** `clearStorage(): void` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L325) (L325–330)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.storageKey`, `sessionStorage.removeItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `PurchaseDraftStore.storageKey`

- **Firma:** `storageKey(): string \| null` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L333) (L333–336)
- **Propósito / descripción:** `null` when nobody is logged in yet — nothing to scope a key to, so persistence is silently skipped rather than falling back to a shared/anonymous key.
- **Dependencias (llamadas en su cuerpo):** `this.authService.currentUser`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

#### Función `todayIsoDate` (L12–16)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L12)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `now.getTimezoneOffset`, `new Date(now.getTime() - offset * 60_000).toISOString().slice`, `new Date(now.getTime() - offset * 60_000).toISOString`, `now.getTime`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `newDraftId` (L18–20)

- **Tipo:** función local del archivo
- **Firma:** `newDraftId(): string` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L18)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `crypto.randomUUID`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `makeBlankDraft` (L35–45)

- **Tipo:** función local del archivo
- **Firma:** `makeBlankDraft(): PurchaseDraft` — [purchase-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/purchase-draft.store.ts#L35)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `newDraftId`, `todayIsoDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-purchases-service-ts"></a>

### purchases.service.ts

- **Ruta:** [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts) (`comercial-jhoel-app/src/app/core/services/purchases.service.ts`, 108 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `PurchasesService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [purchases-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-daily-chart-purchases-daily-chart-component-ts), [purchases-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-weekly-chart-purchases-weekly-chart-component-ts), [purchases-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-yearly-chart-purchases-yearly-chart-component-ts), [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), [purchase-detail-modal.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-components-purchase-detail-modal-purchase-detail-modal-component-ts), [purchases-admin-page.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts), [alert-bell.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-components-alert-bell-alert-bell-component-ts)

#### Clase `PurchasesService` (L20–107)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `createPurchase` | método public | 25–27 | `input: CreatePurchaseInput` | `Observable<Purchase>` |
| `getPurchases` | método public | 30–42 | `filters?: ListPurchasesFilters` | `Observable<PaginatedResponse<Purchase>>` |
| `getPurchaseById` | método public | 44–46 | `id: string` | `Observable<Purchase>` |
| `markAsPaid` | método public | 49–53 | `id: string` | `Observable<Purchase>` |
| `exportPurchasePdf` | método public | 56–58 | `id: string` | `Observable<Blob>` |
| `voidPurchase` | método public | 61–65 | `id: string`, `reason: string` | `Observable<Purchase>` |
| `downloadInitialStockTemplate` | método public | 68–70 | — | `Observable<Blob>` |
| `importInitialStockExcel` | método public | 79–85 | `file: File` | `Observable<ImportPurchaseResult>` |
| `getDailyStats` | método public | 88–92 | — | `Observable<PurchasesDailyStats>` |
| `getWeeklyStats` | método public | 95–99 | — | `Observable<PurchasesWeeklyStats>` |
| `getYearlyStats` | método public | 102–106 | — | `Observable<PurchasesYearlyStats>` |

##### `PurchasesService.createPurchase`

- **Firma:** `createPurchase(input: CreatePurchaseInput): Observable<Purchase>` — [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts#L25) (L25–27)
- **Propósito / descripción:** One atomic call — the backend's `confirm_purchase` function creates the purchase, its details, increases stock, and updates product prices.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Purchase>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchasesService.getPurchases`

- **Firma:** `getPurchases(filters?: ListPurchasesFilters): Observable<PaginatedResponse<Purchase>>` — [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts#L30) (L30–42)
- **Propósito / descripción:** A USER account only ever gets their own purchases back — the backend decides that, not this call. An admin (e.g. "Administrar Facturas de Compras") sees every purchase, filtered by whatever `filters` carries.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams`, `Object.entries`, `params.set`, `String`, `this.http.get<ApiSuccessResponse<PaginatedResponse<Purchase>>>(BASE_URL, { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [purchases-admin-page.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts)

##### `PurchasesService.getPurchaseById`

- **Firma:** `getPurchaseById(id: string): Observable<Purchase>` — [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Purchase>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [purchase-detail-modal.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-components-purchase-detail-modal-purchase-detail-modal-component-ts)

##### `PurchasesService.markAsPaid`

- **Firma:** `markAsPaid(id: string): Observable<Purchase>` — [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts#L49) (L49–53)
- **Propósito / descripción:** "Marcar como pagada" — operational, no admin check on this side either (mirrors the backend's own policy).
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Purchase>>('${BASE_URL}/${id}/pay', {}).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/pay'`
- **Consumidores:** [alert-bell.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-components-alert-bell-alert-bell-component-ts)

##### `PurchasesService.exportPurchasePdf`

- **Firma:** `exportPurchasePdf(id: string): Observable<Blob>` — [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts#L56) (L56–58)
- **Propósito / descripción:** Reconstructs the invoice PDF purely from the already-persisted purchase — never re-runs the save.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}/pdf'`
- **Consumidores:** [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts)

##### `PurchasesService.voidPurchase`

- **Firma:** `voidPurchase(id: string, reason: string): Observable<Purchase>` — [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts#L61) (L61–65)
- **Propósito / descripción:** "Anular factura" — admin-only server-side; never a physical delete/edit, marks the purchase `ANULADA` and reverses its exact inventory effect atomically.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Purchase>>('${BASE_URL}/${id}/void', { reason }).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/void'`
- **Consumidores:** [purchases-admin-page.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts)

##### `PurchasesService.downloadInitialStockTemplate`

- **Firma:** `downloadInitialStockTemplate(): Observable<Blob>` — [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts#L68) (L68–70)
- **Propósito / descripción:** The blank `.xlsx` template `ImportPurchaseFromExcelUseCase` expects — same blob-download shape as Products' own import template.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/import/template'`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts)

##### `PurchasesService.importInitialStockExcel`

- **Firma:** `importInitialStockExcel(file: File): Observable<ImportPurchaseResult>` — [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts#L79) (L79–85)
- **Propósito / descripción:** "Cargar stock inicial (Excel)" — `POST /purchases/import`, a plain JSON response (counts + skipped rows), not a file, so unlike the template download this is a normal `FormData` upload with no `responseType: 'blob'`. Every row the backend accepted is already a real, saved purchase by the time this resolves.
- **Dependencias (llamadas en su cuerpo):** `new FormData`, `formData.append`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/import'`
- **Consumidores:** [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts)

##### `PurchasesService.getDailyStats`

- **Firma:** `getDailyStats(): Observable<PurchasesDailyStats>` — [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts#L88) (L88–92)
- **Propósito / descripción:** Open to any authenticated account — backs "Compras del mes" en Gráficas → Indicadores de Compras, siempre el mes actual del servidor.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PurchasesDailyStats>>('${BASE_URL}/daily-stats').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/daily-stats'`
- **Consumidores:** [purchases-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-daily-chart-purchases-daily-chart-component-ts)

##### `PurchasesService.getWeeklyStats`

- **Firma:** `getWeeklyStats(): Observable<PurchasesWeeklyStats>` — [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts#L95) (L95–99)
- **Propósito / descripción:** Open to any authenticated account — backs "Compras por semana".
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PurchasesWeeklyStats>>('${BASE_URL}/weekly-stats').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/weekly-stats'`
- **Consumidores:** [purchases-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-weekly-chart-purchases-weekly-chart-component-ts)

##### `PurchasesService.getYearlyStats`

- **Firma:** `getYearlyStats(): Observable<PurchasesYearlyStats>` — [purchases.service.ts](../../../../comercial-jhoel-app/src/app/core/services/purchases.service.ts#L102) (L102–106)
- **Propósito / descripción:** Open to any authenticated account — backs "Compras por mes" (anual).
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<PurchasesYearlyStats>>('${BASE_URL}/yearly-stats').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/yearly-stats'`
- **Consumidores:** [purchases-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-yearly-chart-purchases-yearly-chart-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-push-notification-service-ts"></a>

### push-notification.service.ts

- **Ruta:** [push-notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/push-notification.service.ts) (`comercial-jhoel-app/src/app/core/services/push-notification.service.ts`, 300 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Envuelve `SwPush` (el mismo Service Worker de PWA registrado en `app.config.ts` — nunca uno segundo) para el flujo público de notificaciones push de Noticias.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-news-subscription.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-news-subscription-service-ts)
- **Paquetes externos:** `@angular/core`, `@angular/service-worker`, `rxjs`
- **Consumidores:** [notifications-modal.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts)

#### Clase `PushNotificationService` (L35–299)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Envuelve `SwPush` (el mismo Service Worker de PWA registrado en `app.config.ts` — nunca uno segundo) para el flujo público de notificaciones push de Noticias. Ver `core/models/push-notification.model.ts` para por qué `PushPermissionState` tiene 6 valores y no puede distinguir "negado" de "bloqueado" — es una limitación real del navegador, no de este servicio. Nota para desarrollo local: `app.config.ts` registra el Service Worker solo cuando `!isDevMode()` (`ng build`, nunca `ng serve`) — en dev, `swPush.isEnabled` siempre es `false` y `permissionState()` reporta `'unsupported'` aunque el navegador sí sea compatible. Para probar el flujo de verdad localmente: `ng build` + servir `dist/comercial-jhoel-app` con cualquier servidor estático sobre HTTPS o `localhost` (el Service Worker exige uno de los dos).
- **Servicios inyectados con `inject()`:** `swPush = inject(SwPush)`, `publicNewsSubscriptionService = inject(PublicNewsSubscriptionService)`
- **Datos / estado que administra:** `isSubscribed = signal(false)`, `isBusy = signal(false)`, `errorMessage = signal<string \| null>(null)`, `permissionState = signal<PushPermissionState>(this.computePermission`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `refreshPermissionState` | método private | 115–117 | — | `void` |
| `computePermissionState` | método private | 119–168 | — | `PushPermissionState` |
| `isIosNeedingInstall` | método private | 186–197 | — | `boolean` |
| `subscribe` | método public async | 218–259 | `typeIds: string[]` | `Promise<void>` |
| `unsubscribe` | método public async | 266–280 | — | `Promise<void>` |
| `getManageToken` | método private | 282–288 | — | `string \| null` |
| `setManageToken` | método private | 290–298 | `token: string` | `void` |

##### `PushNotificationService.refreshPermissionState`

- **Firma:** `refreshPermissionState(): void` — [push-notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/push-notification.service.ts#L115) (L115–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.permissionState.set`, `this.computePermissionState`
- **Efectos secundarios:** Actualiza estado (signals): `this.permissionState.set`
- **Consumidores:** (mismo archivo)

##### `PushNotificationService.computePermissionState`

- **Firma:** `computePermissionState(): PushPermissionState` — [push-notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/push-notification.service.ts#L119) (L119–168)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isIosNeedingInstall`, `console.warn`, `window.matchMedia`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `PushNotificationService.isIosNeedingInstall`

- **Firma:** `isIosNeedingInstall(): boolean` — [push-notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/push-notification.service.ts#L186) (L186–197)
- **Propósito / descripción:** iOS/iPadOS Safari (16.4+) solo ofrece el permiso de Push a un sitio agregado a la pantalla de inicio (`display-mode: standalone`) — en pestaña normal, `Notification.requestPermission()` existe en el DOM pero el navegador la rechaza silenciosamente sin mostrar ningún prompt. Detectar esto de antemano evita prometerle al visitante un botón que, en pestaña normal, nunca podría funcionar. NUNCA aplica a macOS (confirmado, no asumido — ver WebKit/Apple Developer docs sobre Web Push en Safari 16.1/macOS Ventura): a diferencia de iOS/iPadOS, Mac Safari SÍ permite pedir el permiso de Push desde una pestaña normal, sin necesidad de "Agregar al Dock" — por eso el heurístico de abajo excluye explícitam
- **Dependencias (llamadas en su cuerpo):** `/iPad\|iPhone\|iPod/.test`, `ua.includes`, `window.matchMedia`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `PushNotificationService.subscribe`

- **Firma:** `subscribe(typeIds: string[]): Promise<void>` — [push-notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/push-notification.service.ts#L218) (L218–259)
- **Propósito / descripción:** CRÍTICO para Safari (iOS/iPadOS/macOS), causa raíz real de "funciona en Chrome/Android pero no en Apple" — confirmado, no asumido: Safari (y Firefox) exigen que el permiso de Push se pida dentro del mismo "user activation" del clic; cualquier `await` sobre una operación genuinamente asíncrona (una petición de red) ANTES de pedir el permiso hace que WebKit considere que el permiso ya no viene de una acción directa del usuario y lo rechace en silencio — sin mostrar el prompt nativo y sin lanzar un error explícito. Chrome es mucho más permisivo con esto, por eso el bug era invisible en Android/Chrome. La corrección es usar `cachedVapidPublicKey` (precargado en el constructor, mucho antes de que
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isBusy.set`, `firstValueFrom`, `this.publicNewsSubscriptionService.getVapidPublicKey`, `new Error`, `this.swPush.requestSubscription`, `subscription.toJSON`, `this.publicNewsSubscriptionService.registerPush`, `this.getManageToken`, `this.setManageToken`, `this.isSubscribed.set`, `this.refreshPermissionState`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isBusy.set`, `this.isSubscribed.set`
- **Errores que lanza:** `new Error('El servicio de notificaciones no está disponible en este momento. Inténtalo más tarde.')`, `new Error('No se pudo completar el registro de notificaciones.')`, `error`
- **Consumidores:** [notifications-modal.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts)

##### `PushNotificationService.unsubscribe`

- **Firma:** `unsubscribe(): Promise<void>` — [push-notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/push-notification.service.ts#L266) (L266–280)
- **Propósito / descripción:** Desactiva SOLO esta suscripción (este navegador/dispositivo) — nunca afecta otras suscripciones del mismo suscriptor en otros dispositivos, por diseño: el backend desactiva por `endpoint`, nunca por subscriber.
- **Dependencias (llamadas en su cuerpo):** `this.isBusy.set`, `firstValueFrom`, `this.publicNewsSubscriptionService.unregisterPush`, `this.swPush.unsubscribe`, `this.isSubscribed.set`, `this.refreshPermissionState`
- **Efectos secundarios:** Actualiza estado (signals): `this.isBusy.set`, `this.isSubscribed.set`
- **Consumidores:** [notifications-modal.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-components-notifications-modal-notifications-modal-component-ts)

##### `PushNotificationService.getManageToken`

- **Firma:** `getManageToken(): string \| null` — [push-notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/push-notification.service.ts#L282) (L282–288)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `localStorage.getItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `PushNotificationService.setManageToken`

- **Firma:** `setManageToken(token: string): void` — [push-notification.service.ts](../../../../comercial-jhoel-app/src/app/core/services/push-notification.service.ts#L290) (L290–298)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `localStorage.setItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-core-services-quotations-service-ts"></a>

### quotations.service.ts

- **Ruta:** [quotations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/quotations.service.ts) (`comercial-jhoel-app/src/app/core/services/quotations.service.ts`, 68 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** A Cotización is explicitly NOT a sale — this service only ever calls `/quotations`, never `/sales` or `/inventory`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [create-quotation-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts), [quotation-detail-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-detail-modal-quotation-detail-modal-component-ts), [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts)

#### Clase `QuotationsService` (L18–67)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** A Cotización is explicitly NOT a sale — this service only ever calls `/quotations`, never `/sales` or `/inventory`.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `createQuotation` | método public | 22–24 | `input: CreateQuotationInput` | `Observable<Quotation>` |
| `getQuotations` | método public | 26–52 | `query?: ListQuotationsQuery` | `Observable<PaginatedResponse<QuotationSummary>>` |
| `getQuotationById` | método public | 54–56 | `id: string` | `Observable<Quotation>` |
| `exportQuotationPdf` | método public | 58–60 | `id: string` | `Observable<Blob>` |
| `voidQuotation` | método public | 62–66 | `id: string`, `reason: string` | `Observable<Quotation>` |

##### `QuotationsService.createQuotation`

- **Firma:** `createQuotation(input: CreateQuotationInput): Observable<Quotation>` — [quotations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/quotations.service.ts#L22) (L22–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Quotation>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [create-quotation-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts)

##### `QuotationsService.getQuotations`

- **Firma:** `getQuotations(query?: ListQuotationsQuery): Observable<PaginatedResponse<QuotationSummary>>` — [quotations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/quotations.service.ts#L26) (L26–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts)

##### `QuotationsService.getQuotationById`

- **Firma:** `getQuotationById(id: string): Observable<Quotation>` — [quotations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/quotations.service.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Quotation>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [quotation-detail-modal.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-detail-modal-quotation-detail-modal-component-ts)

##### `QuotationsService.exportQuotationPdf`

- **Firma:** `exportQuotationPdf(id: string): Observable<Blob>` — [quotations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/quotations.service.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}/pdf'`
- **Consumidores:** [create-quotation-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-create-quotation-tab-create-quotation-tab-component-ts), [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts)

##### `QuotationsService.voidQuotation`

- **Firma:** `voidQuotation(id: string, reason: string): Observable<Quotation>` — [quotations.service.ts](../../../../comercial-jhoel-app/src/app/core/services/quotations.service.ts#L62) (L62–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Quotation>>('${BASE_URL}/${id}/void', { reason }).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/void'`
- **Consumidores:** [quotation-history-tab.component.ts](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-history-tab-quotation-history-tab-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-recharge-cash-box-service-ts"></a>

### recharge-cash-box.service.ts

- **Ruta:** [recharge-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-cash-box.service.ts) (`comercial-jhoel-app/src/app/core/services/recharge-cash-box.service.ts`, 80 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** "Gestión Caja Recargas" — fully independent from `RechargesService` (moved out of it per an explicit follow-up: this used to be a section embedded inside the Recargas Electrónicas page; it's now its own Sistema-level module with its own route, sidebar entry, and backend module).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [cash-box-card.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-card-cash-box-card-component-ts), [cash-box-contribution-modal.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-contribution-modal-cash-box-contribution-modal-component-ts), [cash-box-history.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-history-cash-box-history-component-ts), [cash-box-withdrawal-modal.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-withdrawal-modal-cash-box-withdrawal-modal-component-ts)

#### Clase `RechargeCashBoxService` (L25–79)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** "Gestión Caja Recargas" — fully independent from `RechargesService` (moved out of it per an explicit follow-up: this used to be a section embedded inside the Recargas Electrónicas page; it's now its own Sistema-level module with its own route, sidebar entry, and backend module). Mirrors the backend's own `RechargeCashBoxModule` boundary.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getBalance` | método public | 30–35 | `date?: string` | `Observable<CashBoxBalance>` |
| `getMovements` | método public | 37–57 | `filters: CashBoxMovementsFilters` | `Observable<PaginatedCashBoxMovements>` |
| `registerWithdrawal` | método public | 60–64 | `input: RegisterCashBoxWithdrawalInput` | `Observable<CashBoxMovementRecord>` |
| `registerContribution` | método public | 67–71 | `input: RegisterCashBoxContributionInput` | `Observable<CashBoxMovementRecord>` |
| `voidMovement` | método public | 74–78 | `id: string`, `reason: string` | `Observable<CashBoxMovementRecord>` |

##### `RechargeCashBoxService.getBalance`

- **Firma:** `getBalance(date?: string): Observable<CashBoxBalance>` — [recharge-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-cash-box.service.ts#L30) (L30–35)
- **Propósito / descripción:** `date` defaults to today server-side when omitted.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams().set`, `new HttpParams`, `this.http.get<ApiSuccessResponse<CashBoxBalance>>('${BASE_URL}/balance', { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/balance'`
- **Consumidores:** [cash-box-card.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-card-cash-box-card-component-ts)

##### `RechargeCashBoxService.getMovements`

- **Firma:** `getMovements(filters: CashBoxMovementsFilters): Observable<PaginatedCashBoxMovements>` — [recharge-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-cash-box.service.ts#L37) (L37–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams`, `params.set`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/movements'`
- **Consumidores:** [cash-box-history.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-history-cash-box-history-component-ts)

##### `RechargeCashBoxService.registerWithdrawal`

- **Firma:** `registerWithdrawal(input: RegisterCashBoxWithdrawalInput): Observable<CashBoxMovementRecord>` — [recharge-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-cash-box.service.ts#L60) (L60–64)
- **Propósito / descripción:** Admin-only server-side ("Salida de Ganancia") — see `RegisterCashBoxWithdrawalUseCase`'s own doc comment for why the balance-exceeded check is never duplicated client-side beyond a UX echo.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/withdrawals'`
- **Consumidores:** [cash-box-withdrawal-modal.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-withdrawal-modal-cash-box-withdrawal-modal-component-ts)

##### `RechargeCashBoxService.registerContribution`

- **Firma:** `registerContribution(input: RegisterCashBoxContributionInput): Observable<CashBoxMovementRecord>` — [recharge-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-cash-box.service.ts#L67) (L67–71)
- **Propósito / descripción:** Admin-only server-side ("Aporte a Caja") — unlike a withdrawal, never rejected for exceeding a balance; it only ever adds.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/contributions'`
- **Consumidores:** [cash-box-contribution-modal.component.ts](dashboard-recharge-cash-box.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-cash-box-components-cash-box-contribution-modal-cash-box-contribution-modal-component-ts)

##### `RechargeCashBoxService.voidMovement`

- **Firma:** `voidMovement(id: string, reason: string): Observable<CashBoxMovementRecord>` — [recharge-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-cash-box.service.ts#L74) (L74–78)
- **Propósito / descripción:** Works for either movement type (aporte or salida) — one generic void endpoint.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/movements/${id}/void'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-recharge-day-status-service-ts"></a>

### recharge-day-status.service.ts

- **Ruta:** [recharge-day-status.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-day-status.service.ts) (`comercial-jhoel-app/src/app/core/services/recharge-day-status.service.ts`, 52 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Shared "is today's Recargas day open?" state — a `providedIn: 'root'` singleton, same pattern as `DayStatusService` (Bancos/Cuadre Agentes), fully independent from it: separate backend table, separate lifecycle, never shares state with Bancos' own day-opening.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [recharges.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [recharge-days-page.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts), [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

#### Clase `RechargeDayStatusService` (L17–51)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Shared "is today's Recargas day open?" state — a `providedIn: 'root'` singleton, same pattern as `DayStatusService` (Bancos/Cuadre Agentes), fully independent from it: separate backend table, separate lifecycle, never shares state with Bancos' own day-opening. Always represents TODAY — `RechargesPageComponent` has its own `pastDateStatus` signal for browsing a non-today date, mirroring `BankAgentsPageComponent`'s identical pattern.
- **Servicios inyectados con `inject()`:** `rechargesService = inject(RechargesService)`
- **Datos / estado que administra:** `status = signal<RechargeDayStatus \| null>(null)`, `loading = signal(true)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `refresh` | método public | 28–42 | — | `void` |
| `openDay` | método public | 44–46 | — | `Observable<RechargeDayStatus>` |
| `closeDay` | método public | 48–50 | — | `Observable<RechargeDayStatus>` |

##### `RechargeDayStatusService.refresh`

- **Firma:** `refresh(): void` — [recharge-day-status.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-day-status.service.ts#L28) (L28–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.rechargesService.getDayStatus().subscribe`, `this.rechargesService.getDayStatus`, `this.status.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.status.set`
- **Consumidores:** [recharge-days-page.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts), [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargeDayStatusService.openDay`

- **Firma:** `openDay(): Observable<RechargeDayStatus>` — [recharge-day-status.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-day-status.service.ts#L44) (L44–46)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.rechargesService.openDay().pipe`, `this.rechargesService.openDay`, `tap`, `this.status.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.status.set`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargeDayStatusService.closeDay`

- **Firma:** `closeDay(): Observable<RechargeDayStatus>` — [recharge-day-status.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-day-status.service.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.rechargesService.closeDay().pipe`, `this.rechargesService.closeDay`, `tap`, `this.status.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.status.set`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-recharge-days-service-ts"></a>

### recharge-days.service.ts

- **Ruta:** [recharge-days.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-days.service.ts) (`comercial-jhoel-app/src/app/core/services/recharge-days.service.ts`, 53 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** "Sistema → Gestión de Días de Recargas" — the Recargas-specific counterpart to `ClosedDaysService` (Bancos), fully independent from it.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [recharge-day-detail-modal.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-recharge-day-detail-modal-recharge-day-detail-modal-component-ts), [recharge-days-page.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts)

#### Clase `RechargeDaysService` (L18–52)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** "Sistema → Gestión de Días de Recargas" — the Recargas-specific counterpart to `ClosedDaysService` (Bancos), fully independent from it. Every backend route (`RechargeDaysController`) already requires ADMIN/SUPER_ADMIN via a class-level `@Roles`; this service doesn't repeat that check, it's just the HTTP client. `authInterceptor` attaches the JWT automatically.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getClosedDays` | método public | 22–33 | `filters: RechargeClosedDaysFilters` | `Observable<RechargeClosedDayRow[]>` |
| `getDayDetail` | método public | 35–39 | `date: string` | `Observable<RechargeDayDetail>` |
| `reopenDay` | método public | 41–45 | `date: string`, `reason: string` | `Observable<RechargeDayDetail>` |
| `cancelDay` | método public | 47–51 | `date: string`, `reason: string` | `Observable<RechargeDayDetail>` |

##### `RechargeDaysService.getClosedDays`

- **Firma:** `getClosedDays(filters: RechargeClosedDaysFilters): Observable<RechargeClosedDayRow[]>` — [recharge-days.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-days.service.ts#L22) (L22–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<RechargeClosedDayRow[]>>(BASE_URL, { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [recharge-days-page.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts)

##### `RechargeDaysService.getDayDetail`

- **Firma:** `getDayDetail(date: string): Observable<RechargeDayDetail>` — [recharge-days.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-days.service.ts#L35) (L35–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<RechargeDayDetail>>('${BASE_URL}/${date}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${date}'`
- **Consumidores:** [recharge-day-detail-modal.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-components-recharge-day-detail-modal-recharge-day-detail-modal-component-ts)

##### `RechargeDaysService.reopenDay`

- **Firma:** `reopenDay(date: string, reason: string): Observable<RechargeDayDetail>` — [recharge-days.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-days.service.ts#L41) (L41–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${date}/reopen'`
- **Consumidores:** [recharge-days-page.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts)

##### `RechargeDaysService.cancelDay`

- **Firma:** `cancelDay(date: string, reason: string): Observable<RechargeDayDetail>` — [recharge-days.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-days.service.ts#L47) (L47–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${date}/cancel'`
- **Consumidores:** [recharge-days-page.component.ts](dashboard-recharge-days.md#f-comercial-jhoel-app-src-app-features-dashboard-recharge-days-recharge-days-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-recharge-sims-service-ts"></a>

### recharge-sims.service.ts

- **Ruta:** [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts) (`comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts`, 133 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Mirrors `RechargesService`'s own shape — a fully separate service hitting `/recharges/sims/*`, never mixed with the electronic-balance endpoints.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [register-sim-purchase-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-purchase-form-register-sim-purchase-form-component-ts), [register-sim-sale-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-sale-form-register-sim-sale-form-component-ts), [register-sim-sale-registration-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-sale-registration-form-register-sim-sale-registration-form-component-ts), [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [sim-sale-registration-detail-modal.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-components-sim-sale-registration-detail-modal-sim-sale-registration-detail-modal-component-ts), [recharges-sim-sales-admin-page.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-recharges-sim-sales-admin-page-component-ts)

#### Clase `RechargeSimsService` (L22–132)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Mirrors `RechargesService`'s own shape — a fully separate service hitting `/recharges/sims/*`, never mixed with the electronic-balance endpoints.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getTypes` | método public | 26–30 | — | `Observable<SimType[]>` |
| `getDailyStock` | método public | 33–38 | `date?: string` | `Observable<SimDailyStock[]>` |
| `registerPurchase` | método public | 40–44 | `input: RegisterSimPurchaseInput` | `Observable<SimDailyStock>` |
| `registerSale` | método public | 46–50 | `input: RegisterSimSaleInput` | `Observable<SimDailyStock>` |
| `getSales` | método public | 53–58 | `date?: string` | `Observable<SimSale[]>` |
| `voidSale` | método public | 61–65 | `id: string`, `reason: string` | `Observable<SimSale>` |
| `registerSaleRegistration` | método public | 77–94 | `input: RegisterSimSaleRegistrationInput` | `Observable<SimSaleRegistration>` |
| `getSaleRegistrations` | método public | 97–111 | `filters?: ListSimSaleRegistrationsFilters` | `Observable<PaginatedSimSaleRegistrations>` |
| `getSaleRegistrationById` | método public | 113–117 | `id: string` | `Observable<SimSaleRegistration>` |
| `getDpiImage` | método public | 120–124 | `registrationId: string` | `Observable<Blob>` |
| `voidSaleRegistration` | método public | 127–131 | `id: string`, `reason: string` | `Observable<SimSaleRegistration>` |

##### `RechargeSimsService.getTypes`

- **Firma:** `getTypes(): Observable<SimType[]>` — [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts#L26) (L26–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<SimType[]>>('${BASE_URL}/types').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/types'`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargeSimsService.getDailyStock`

- **Firma:** `getDailyStock(date?: string): Observable<SimDailyStock[]>` — [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts#L33) (L33–38)
- **Propósito / descripción:** `date` defaults to today server-side when omitted — pass the operation-date picker's value to browse another day.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams().set`, `new HttpParams`, `this.http.get<ApiSuccessResponse<SimDailyStock[]>>('${BASE_URL}/daily', { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/daily'`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargeSimsService.registerPurchase`

- **Firma:** `registerPurchase(input: RegisterSimPurchaseInput): Observable<SimDailyStock>` — [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts#L40) (L40–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<SimDailyStock>>('${BASE_URL}/purchases', input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/purchases'`
- **Consumidores:** [register-sim-purchase-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-purchase-form-register-sim-purchase-form-component-ts)

##### `RechargeSimsService.registerSale`

- **Firma:** `registerSale(input: RegisterSimSaleInput): Observable<SimDailyStock>` — [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts#L46) (L46–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<SimDailyStock>>('${BASE_URL}/sales', input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/sales'`
- **Consumidores:** [register-sim-sale-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-sale-form-register-sim-sale-form-component-ts)

##### `RechargeSimsService.getSales`

- **Firma:** `getSales(date?: string): Observable<SimSale[]>` — [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts#L53) (L53–58)
- **Propósito / descripción:** "Administrar Ventas de SIM (por cantidad)" listing — the by-quantity flow's own admin screen, separate from `getSaleRegistrations()` above. `date` defaults to today server-side when omitted.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams().set`, `new HttpParams`, `this.http.get<ApiSuccessResponse<SimSale[]>>('${BASE_URL}/sales', { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/sales'`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargeSimsService.voidSale`

- **Firma:** `voidSale(id: string, reason: string): Observable<SimSale>` — [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts#L61) (L61–65)
- **Propósito / descripción:** "Revertir" — admin-only server-side; never a physical delete/edit, restores the SIM stock it decremented.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/sales/${id}/void'`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargeSimsService.registerSaleRegistration`

- **Firma:** `registerSaleRegistration(input: RegisterSimSaleRegistrationInput): Observable<SimSaleRegistration>` — [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts#L77) (L77–94)
- **Propósito / descripción:** "Venta de SIM con registro de identidad" — `FormData`, not JSON, since `dpiImage` (when present) is a real file, not base64: the first genuine file upload in this app (see `company-settings-page`'s own logo picker for why that one goes through JSON/base64 instead — a small, already- text-safe payload with no existing multipart infra to reuse). Angular's `HttpClient` sets the correct `multipart/form-data` boundary header automatically when given a `FormData` body — never set `Content-Type` manually here, doing so drops the boundary and breaks the upload.
- **Dependencias (llamadas en su cuerpo):** `new FormData`, `formData.set`, `String`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/sale-registrations'`
- **Consumidores:** [register-sim-sale-registration-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-sim-sale-registration-form-register-sim-sale-registration-form-component-ts)

##### `RechargeSimsService.getSaleRegistrations`

- **Firma:** `getSaleRegistrations(filters?: ListSimSaleRegistrationsFilters): Observable<PaginatedSimSaleRegistrations>` — [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts#L97) (L97–111)
- **Propósito / descripción:** "Administrar Ventas de SIM" listing — same pagination shape as `PurchasesService.getPurchases`.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams`, `Object.entries`, `params.set`, `String`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/sale-registrations'`
- **Consumidores:** [recharges-sim-sales-admin-page.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-recharges-sim-sales-admin-page-component-ts)

##### `RechargeSimsService.getSaleRegistrationById`

- **Firma:** `getSaleRegistrationById(id: string): Observable<SimSaleRegistration>` — [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts#L113) (L113–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/sale-registrations/${id}'`
- **Consumidores:** [sim-sale-registration-detail-modal.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-components-sim-sale-registration-detail-modal-sim-sale-registration-detail-modal-component-ts)

##### `RechargeSimsService.getDpiImage`

- **Firma:** `getDpiImage(registrationId: string): Observable<Blob>` — [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts#L120) (L120–124)
- **Propósito / descripción:** Fetched as a `Blob`, never a direct `&lt;img [src]&gt;` URL — the endpoint requires a JWT (`authInterceptor` attaches it to any `environment.apiUrl` request), which a bare `&lt;img src&gt;` can never send. The caller turns this into an object URL via `URL.createObjectURL` and revokes it when done.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/sale-registrations/${registrationId}/dpi-image'`
- **Consumidores:** [sim-sale-registration-detail-modal.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-components-sim-sale-registration-detail-modal-sim-sale-registration-detail-modal-component-ts)

##### `RechargeSimsService.voidSaleRegistration`

- **Firma:** `voidSaleRegistration(id: string, reason: string): Observable<SimSaleRegistration>` — [recharge-sims.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts#L127) (L127–131)
- **Propósito / descripción:** "Anular" — admin-only server-side; never a physical delete/edit, restores the underlying sale's SIM stock atomically.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/sale-registrations/${id}/void'`
- **Consumidores:** [recharges-sim-sales-admin-page.component.ts](dashboard-recharges-sim-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-sim-sales-admin-recharges-sim-sales-admin-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-recharges-service-ts"></a>

### recharges.service.ts

- **Ruta:** [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts) (`comercial-jhoel-app/src/app/core/services/recharges.service.ts`, 174 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `RechargesService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [recharge-day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-day-status-service-ts), [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts), [recharges-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-daily-chart-recharges-daily-chart-component-ts), [recharges-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-weekly-chart-recharges-weekly-chart-component-ts), [recharges-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-yearly-chart-recharges-yearly-chart-component-ts), [recharge-indicators-section.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-components-recharge-indicators-section-recharge-indicators-section-component-ts), [recharge-sale-form-modal.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sale-form-modal-recharge-sale-form-modal-component-ts), [register-purchase-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-purchase-form-register-purchase-form-component-ts), [sales-summary-card.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sales-summary-card-sales-summary-card-component-ts), [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts), [recharges-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-recharges-recharges-report-page-component-ts)

#### Clase `RechargesService` (L27–173)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getTypes` | método public | 31–35 | — | `Observable<RechargeType[]>` |
| `updateTypeMinBalance` | método public | 38–42 | `id: string`, `minBalance: number` | `Observable<RechargeType>` |
| `updateTypeBalanceLimit` | método public | 45–49 | `id: string`, `balanceLimit: number` | `Observable<RechargeType>` |
| `getDailySummary` | método public | 52–57 | `date?: string` | `Observable<RechargeDailyBalance[]>` |
| `registerPurchase` | método public | 59–63 | `input: RegisterRechargePurchaseInput` | `Observable<RechargeDailyBalance>` |
| `getPurchases` | método public | 66–71 | `date?: string` | `Observable<RechargePurchase[]>` |
| `voidPurchase` | método public | 74–78 | `id: string`, `reason: string` | `Observable<RechargePurchase>` |
| `registerFinalBalance` | método public | 80–84 | `dailyBalanceId: string`, `input: RegisterRechargeFinalBalanceInput` | `Observable<RechargeDailyBalance>` |
| `getSalesSummary` | método public | 87–92 | `date?: string` | `Observable<RechargeSalesSummary>` |
| `registerSalesClosure` | método public | 94–98 | `input: RegisterRechargeSalesClosureInput` | `Observable<RechargeSalesSummary>` |
| `getSales` | método public | 101–106 | `date?: string` | `Observable<RechargeSale[]>` |
| `registerSale` | método public | 108–112 | `input: RegisterRechargeSaleInput` | `Observable<RechargeSale>` |
| `updateSale` | método public | 114–118 | `id: string`, `input: UpdateRechargeSaleInput` | `Observable<RechargeSale>` |
| `deleteSale` | método public | 120–122 | `id: string` | `Observable<void>` |
| `getDayStatus` | método public | 125–130 | `date?: string` | `Observable<RechargeDayStatus>` |
| `openDay` | método public | 133–137 | `date?: string` | `Observable<RechargeDayStatus>` |
| `closeDay` | método public | 140–144 | `date?: string` | `Observable<RechargeDayStatus>` |
| `getDailyStats` | método public | 147–151 | — | `Observable<RechargesDailyStats>` |
| `getWeeklyStats` | método public | 154–158 | — | `Observable<RechargesWeeklyStats>` |
| `getYearlyStats` | método public | 161–165 | — | `Observable<RechargesYearlyStats>` |
| `getOperatorsSummary` | método public | 168–172 | — | `Observable<RechargeOperatorsSummaryResponse>` |

##### `RechargesService.getTypes`

- **Firma:** `getTypes(): Observable<RechargeType[]>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L31) (L31–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<RechargeType[]>>('${BASE_URL}/types').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/types'`
- **Consumidores:** [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts), [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargesService.updateTypeMinBalance`

- **Firma:** `updateTypeMinBalance(id: string, minBalance: number): Observable<RechargeType>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L38) (L38–42)
- **Propósito / descripción:** Admin-only threshold the Alerts module reads for "saldo bajo de recargas".
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/types/${id}/min-balance'`
- **Consumidores:** [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts)

##### `RechargesService.updateTypeBalanceLimit`

- **Firma:** `updateTypeBalanceLimit(id: string, balanceLimit: number): Observable<RechargeType>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L45) (L45–49)
- **Propósito / descripción:** Admin-only — el techo de referencia (100%) de la gráfica de anillo de saldo en Resumen. Distinto de `updateTypeMinBalance` (el umbral de alerta).
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/types/${id}/balance-limit'`
- **Consumidores:** [alert-settings-page.component.ts](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts)

##### `RechargesService.getDailySummary`

- **Firma:** `getDailySummary(date?: string): Observable<RechargeDailyBalance[]>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L52) (L52–57)
- **Propósito / descripción:** `date` defaults to today server-side when omitted — pass the operation-date picker's value to browse another day.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams().set`, `new HttpParams`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/daily'`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargesService.registerPurchase`

- **Firma:** `registerPurchase(input: RegisterRechargePurchaseInput): Observable<RechargeDailyBalance>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L59) (L59–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/purchases'`
- **Consumidores:** [register-purchase-form.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-register-purchase-form-register-purchase-form-component-ts)

##### `RechargesService.getPurchases`

- **Firma:** `getPurchases(date?: string): Observable<RechargePurchase[]>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L66) (L66–71)
- **Propósito / descripción:** `date` defaults to today server-side when omitted — pass the operation-date picker's value to browse another day.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams().set`, `new HttpParams`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/purchases'`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargesService.voidPurchase`

- **Firma:** `voidPurchase(id: string, reason: string): Observable<RechargePurchase>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L74) (L74–78)
- **Propósito / descripción:** "Revertir compra" — admin-only server-side; never a physical delete/edit, marks the purchase `ANULADA` and compensates the balance atomically.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/purchases/${id}/void'`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargesService.registerFinalBalance`

- **Firma:** `registerFinalBalance(dailyBalanceId: string, input: RegisterRechargeFinalBalanceInput): Observable<RechargeDailyBalance>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L80) (L80–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/daily/${dailyBalanceId}/final-balance'`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargesService.getSalesSummary`

- **Firma:** `getSalesSummary(date?: string): Observable<RechargeSalesSummary>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L87) (L87–92)
- **Propósito / descripción:** `date` defaults to today server-side when omitted — pass the operation-date picker's value to browse another day.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams().set`, `new HttpParams`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/sales-summary'`
- **Consumidores:** [sales-summary-card.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sales-summary-card-sales-summary-card-component-ts)

##### `RechargesService.registerSalesClosure`

- **Firma:** `registerSalesClosure(input: RegisterRechargeSalesClosureInput): Observable<RechargeSalesSummary>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L94) (L94–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/sales-closure'`
- **Consumidores:** [sales-summary-card.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-sales-summary-card-sales-summary-card-component-ts)

##### `RechargesService.getSales`

- **Firma:** `getSales(date?: string): Observable<RechargeSale[]>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L101) (L101–106)
- **Propósito / descripción:** `date` defaults to today server-side when omitted — pass the operation-date picker's value to browse another day.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams().set`, `new HttpParams`, `this.http.get<ApiSuccessResponse<RechargeSale[]>>('${BASE_URL}/sales', { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/sales'`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargesService.registerSale`

- **Firma:** `registerSale(input: RegisterRechargeSaleInput): Observable<RechargeSale>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L108) (L108–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<RechargeSale>>('${BASE_URL}/sales', input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/sales'`
- **Consumidores:** [recharge-sale-form-modal.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sale-form-modal-recharge-sale-form-modal-component-ts)

##### `RechargesService.updateSale`

- **Firma:** `updateSale(id: string, input: UpdateRechargeSaleInput): Observable<RechargeSale>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L114) (L114–118)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<RechargeSale>>('${BASE_URL}/sales/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/sales/${id}'`
- **Consumidores:** [recharge-sale-form-modal.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-components-recharge-sale-form-modal-recharge-sale-form-modal-component-ts)

##### `RechargesService.deleteSale`

- **Firma:** `deleteSale(id: string): Observable<void>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L120) (L120–122)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/sales/${id}'`
- **Consumidores:** [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargesService.getDayStatus`

- **Firma:** `getDayStatus(date?: string): Observable<RechargeDayStatus>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L125) (L125–130)
- **Propósito / descripción:** `date` defaults to today server-side when omitted — pass the operation-date picker's value to check another day.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams().set`, `new HttpParams`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/day-status'`
- **Consumidores:** [recharge-day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-day-status-service-ts), [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargesService.openDay`

- **Firma:** `openDay(date?: string): Observable<RechargeDayStatus>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L133) (L133–137)
- **Propósito / descripción:** Idempotent on the backend — a double click or retry never fails or duplicates the opening.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/day-status/open'`
- **Consumidores:** [recharge-day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-day-status-service-ts), [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargesService.closeDay`

- **Firma:** `closeDay(date?: string): Observable<RechargeDayStatus>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L140) (L140–144)
- **Propósito / descripción:** "Cerrar Día" — a standalone action, never a cuadre save; requires at least one cuadre already saved for the date.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/day-status/close'`
- **Consumidores:** [recharge-day-status.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharge-day-status-service-ts), [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

##### `RechargesService.getDailyStats`

- **Firma:** `getDailyStats(): Observable<RechargesDailyStats>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L147) (L147–151)
- **Propósito / descripción:** Open to any authenticated account — backs "Recargas del mes" en Gráficas → Indicadores de Recargas, siempre el mes actual del servidor.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<RechargesDailyStats>>('${BASE_URL}/daily-stats').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/daily-stats'`
- **Consumidores:** [recharges-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-daily-chart-recharges-daily-chart-component-ts)

##### `RechargesService.getWeeklyStats`

- **Firma:** `getWeeklyStats(): Observable<RechargesWeeklyStats>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L154) (L154–158)
- **Propósito / descripción:** Open to any authenticated account — backs "Recargas por semana".
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<RechargesWeeklyStats>>('${BASE_URL}/weekly-stats').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/weekly-stats'`
- **Consumidores:** [recharges-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-weekly-chart-recharges-weekly-chart-component-ts)

##### `RechargesService.getYearlyStats`

- **Firma:** `getYearlyStats(): Observable<RechargesYearlyStats>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L161) (L161–165)
- **Propósito / descripción:** Open to any authenticated account — backs "Recargas por mes" (anual).
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<RechargesYearlyStats>>('${BASE_URL}/yearly-stats').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/yearly-stats'`
- **Consumidores:** [recharges-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-yearly-chart-recharges-yearly-chart-component-ts)

##### `RechargesService.getOperatorsSummary`

- **Firma:** `getOperatorsSummary(): Observable<RechargeOperatorsSummaryResponse>` — [recharges.service.ts](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts#L168) (L168–172)
- **Propósito / descripción:** Open to any authenticated account — backs las 4 gráficas de anillo de "Indicadores de Recargas Electrónicas" en Resumen.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/operators-summary'`
- **Consumidores:** [recharge-indicators-section.component.ts](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-components-recharge-indicators-section-recharge-indicators-section-component-ts), [recharges-page.component.ts](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-reports-service-ts"></a>

### reports.service.ts

- **Ruta:** [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts) (`comercial-jhoel-app/src/app/core/services/reports.service.ts`, 299 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Drops `undefined`/empty-string values — `HttpParams` would otherwise send the literal string `"undefined"` as a query value.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [agent-reconciliations-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts), [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts), [bank-deposits-report-page.component.spec.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-spec-ts), [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [bank-movements-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts), [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts), [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [recharges-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-recharges-recharges-report-page-component-ts), [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts), [transaction-day-detail-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts)

#### Clase `ReportsService` (L54–298)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSalesReport` | método public | 58–64 | `filters: SalesReportFilters` | `Observable<PaginatedReport<SalesReportRow>>` |
| `getSalesReportSummary` | método public | 66–72 | `filters: SalesReportFilters` | `Observable<SalesReportSummary>` |
| `getSalesByProductReport` | método public | 74–80 | `filters: SalesReportFilters` | `Observable<PaginatedReport<SalesByProductRow>>` |
| `getSaleReportDetail` | método public | 82–86 | `id: string` | `Observable<SaleReportDetail>` |
| `exportSalesReportPdf` | método public | 89–94 | `filters: SalesReportFilters` | `Observable<Blob>` |
| `getPurchasesReport` | método public | 96–102 | `filters: PurchasesReportFilters` | `Observable<PaginatedReport<PurchasesReportRow>>` |
| `getPurchasesReportSummary` | método public | 104–110 | `filters: PurchasesReportFilters` | `Observable<PurchasesReportSummary>` |
| `getPurchasesByProductReport` | método public | 112–120 | `filters: PurchasesReportFilters` | `Observable<PaginatedReport<PurchasesByProductRow>>` |
| `getPurchaseReportDetail` | método public | 122–126 | `id: string` | `Observable<PurchaseReportDetail>` |
| `exportPurchasesReportPdf` | método public | 128–133 | `filters: PurchasesReportFilters` | `Observable<Blob>` |
| `getRechargesReport` | método public | 135–141 | `filters: RechargesReportFilters` | `Observable<PaginatedReport<RechargeDailyBalance>>` |
| `getRechargesReportSummary` | método public | 143–149 | `filters: RechargesReportFilters` | `Observable<RechargesReportSummary>` |
| `exportRechargesReportPdf` | método public | 151–156 | `filters: RechargesReportFilters` | `Observable<Blob>` |
| `getAgentReconciliationsReport` | método public | 158–167 | `filters: AgentReconciliationsReportFilters` | `Observable<PaginatedReport<AgentReconciliationsReportRow>>` |
| `getAgentReconciliationsReportSummary` | método public | 169–178 | `filters: AgentReconciliationsReportFilters` | `Observable<AgentReconciliationsReportSummary>` |
| `exportAgentReconciliationsReportPdf` | método public | 180–185 | `filters: AgentReconciliationsReportFilters` | `Observable<Blob>` |
| `getBankDepositsReport` | método public | 187–195 | `filters: BankDepositsReportFilters` | `Observable<PaginatedReport<BankDepositOperationSummary>>` |
| `getBankDepositsReportSummary` | método public | 197–203 | `filters: BankDepositsReportFilters` | `Observable<BankDepositsReportSummary>` |
| `exportBankDepositsReportPdf` | método public | 205–210 | `filters: BankDepositsReportFilters` | `Observable<Blob>` |
| `getAssetsReceivablesReport` | método public | 213–221 | `filters: AssetsReceivablesReportFilters` | `Observable<PaginatedReport<AssetsReceivablesReportRow>>` |
| `getAssetsReceivablesReportSummary` | método public | 223–231 | `filters: AssetsReceivablesReportFilters` | `Observable<AssetsReceivablesReportSummary>` |
| `exportAssetsReceivablesReportPdf` | método public | 233–238 | `filters: AssetsReceivablesReportFilters` | `Observable<Blob>` |
| `getIceCreamReport` | método public | 241–247 | `filters: IceCreamReportFilters` | `Observable<PaginatedReport<IceCreamReportRow>>` |
| `getIceCreamReportSummary` | método public | 249–255 | `filters: IceCreamReportFilters` | `Observable<IceCreamReportSummary>` |
| `exportIceCreamReportPdf` | método public | 257–262 | `filters: IceCreamReportFilters` | `Observable<Blob>` |
| `getBankMovementsReport` | método public | 265–271 | `filters: BankMovementsFilters` | `Observable<PaginatedBankMovements>` |
| `exportBankMovementsReportPdf` | método public | 274–279 | `filters: BankMovementsFilters` | `Observable<Blob>` |
| `getBankTransfersReport` | método public | 282–286 | `filters: BankTransfersReportFilters` | `Observable<PaginatedBankTransfers>` |
| `getBankTransfersReportSummary` | método public | 288–292 | `filters: BankTransfersReportFilters` | `Observable<BankTransfersSummary>` |
| `exportBankTransfersReportPdf` | método public | 295–297 | `filters: BankTransfersReportFilters` | `Observable<Blob>` |

##### `ReportsService.getSalesReport`

- **Firma:** `getSalesReport(filters: SalesReportFilters): Observable<PaginatedReport<SalesReportRow>>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L58) (L58–64)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/sales'`
- **Consumidores:** [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts)

##### `ReportsService.getSalesReportSummary`

- **Firma:** `getSalesReportSummary(filters: SalesReportFilters): Observable<SalesReportSummary>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L66) (L66–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/sales/summary'`
- **Consumidores:** [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts)

##### `ReportsService.getSalesByProductReport`

- **Firma:** `getSalesByProductReport(filters: SalesReportFilters): Observable<PaginatedReport<SalesByProductRow>>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L74) (L74–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/sales/by-product'`
- **Consumidores:** [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts)

##### `ReportsService.getSaleReportDetail`

- **Firma:** `getSaleReportDetail(id: string): Observable<SaleReportDetail>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L82) (L82–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<SaleReportDetail>>('${BASE_URL}/sales/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/sales/${id}'`
- **Consumidores:** [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts)

##### `ReportsService.exportSalesReportPdf`

- **Firma:** `exportSalesReportPdf(filters: SalesReportFilters): Observable<Blob>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L89) (L89–94)
- **Propósito / descripción:** `responseType: 'blob'` — the backend streams a raw PDF, not the usual `{ success, data }` JSON envelope.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/sales/export'`
- **Consumidores:** [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts)

##### `ReportsService.getPurchasesReport`

- **Firma:** `getPurchasesReport(filters: PurchasesReportFilters): Observable<PaginatedReport<PurchasesReportRow>>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L96) (L96–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/purchases'`
- **Consumidores:** [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts)

##### `ReportsService.getPurchasesReportSummary`

- **Firma:** `getPurchasesReportSummary(filters: PurchasesReportFilters): Observable<PurchasesReportSummary>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L104) (L104–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/purchases/summary'`
- **Consumidores:** [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts)

##### `ReportsService.getPurchasesByProductReport`

- **Firma:** `getPurchasesByProductReport(filters: PurchasesReportFilters): Observable<PaginatedReport<PurchasesByProductRow>>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L112) (L112–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/purchases/by-product'`
- **Consumidores:** [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts)

##### `ReportsService.getPurchaseReportDetail`

- **Firma:** `getPurchaseReportDetail(id: string): Observable<PurchaseReportDetail>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L122) (L122–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/purchases/${id}'`
- **Consumidores:** [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts)

##### `ReportsService.exportPurchasesReportPdf`

- **Firma:** `exportPurchasesReportPdf(filters: PurchasesReportFilters): Observable<Blob>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L128) (L128–133)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/purchases/export'`
- **Consumidores:** [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts)

##### `ReportsService.getRechargesReport`

- **Firma:** `getRechargesReport(filters: RechargesReportFilters): Observable<PaginatedReport<RechargeDailyBalance>>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L135) (L135–141)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/recharges'`
- **Consumidores:** [recharges-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-recharges-recharges-report-page-component-ts)

##### `ReportsService.getRechargesReportSummary`

- **Firma:** `getRechargesReportSummary(filters: RechargesReportFilters): Observable<RechargesReportSummary>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L143) (L143–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/recharges/summary'`
- **Consumidores:** [recharges-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-recharges-recharges-report-page-component-ts)

##### `ReportsService.exportRechargesReportPdf`

- **Firma:** `exportRechargesReportPdf(filters: RechargesReportFilters): Observable<Blob>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L151) (L151–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/recharges/export'`
- **Consumidores:** [recharges-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-recharges-recharges-report-page-component-ts)

##### `ReportsService.getAgentReconciliationsReport`

- **Firma:** `getAgentReconciliationsReport(filters: AgentReconciliationsReportFilters): Observable<PaginatedReport<AgentReconciliationsReportRow>>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L158) (L158–167)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/agent-reconciliations'`
- **Consumidores:** [agent-reconciliations-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts)

##### `ReportsService.getAgentReconciliationsReportSummary`

- **Firma:** `getAgentReconciliationsReportSummary(filters: AgentReconciliationsReportFilters): Observable<AgentReconciliationsReportSummary>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L169) (L169–178)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/agent-reconciliations/summary'`
- **Consumidores:** [agent-reconciliations-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts)

##### `ReportsService.exportAgentReconciliationsReportPdf`

- **Firma:** `exportAgentReconciliationsReportPdf(filters: AgentReconciliationsReportFilters): Observable<Blob>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L180) (L180–185)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/agent-reconciliations/export'`
- **Consumidores:** [agent-reconciliations-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-agent-reconciliations-agent-reconciliations-report-page-component-ts)

##### `ReportsService.getBankDepositsReport`

- **Firma:** `getBankDepositsReport(filters: BankDepositsReportFilters): Observable<PaginatedReport<BankDepositOperationSummary>>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L187) (L187–195)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/bank-deposits'`
- **Consumidores:** [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [transaction-day-detail-modal.component.ts](dashboard-transaction-days.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-days-components-transaction-day-detail-modal-transaction-day-detail-modal-component-ts)

##### `ReportsService.getBankDepositsReportSummary`

- **Firma:** `getBankDepositsReportSummary(filters: BankDepositsReportFilters): Observable<BankDepositsReportSummary>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L197) (L197–203)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/bank-deposits/summary'`
- **Consumidores:** [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts)

##### `ReportsService.exportBankDepositsReportPdf`

- **Firma:** `exportBankDepositsReportPdf(filters: BankDepositsReportFilters): Observable<Blob>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L205) (L205–210)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/bank-deposits/export'`
- **Consumidores:** [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts)

##### `ReportsService.getAssetsReceivablesReport`

- **Firma:** `getAssetsReceivablesReport(filters: AssetsReceivablesReportFilters): Observable<PaginatedReport<AssetsReceivablesReportRow>>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L213) (L213–221)
- **Propósito / descripción:** Unified Reportería de Activos y Cuentas por Cobrar — `filters.types` selects one or both tables (`assets`, `accounts_receivable`), matching `AssetsReceivablesReportController`'s checkbox-driven `types` query param. Replaces the former separate accounts-receivable/assets report endpoints.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/assets-receivables'`
- **Consumidores:** [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts)

##### `ReportsService.getAssetsReceivablesReportSummary`

- **Firma:** `getAssetsReceivablesReportSummary(filters: AssetsReceivablesReportFilters): Observable<AssetsReceivablesReportSummary>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L223) (L223–231)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/assets-receivables/summary'`
- **Consumidores:** [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts)

##### `ReportsService.exportAssetsReceivablesReportPdf`

- **Firma:** `exportAssetsReceivablesReportPdf(filters: AssetsReceivablesReportFilters): Observable<Blob>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L233) (L233–238)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/assets-receivables/export'`
- **Consumidores:** [assets-receivables-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-assets-receivables-assets-receivables-report-page-component-ts)

##### `ReportsService.getIceCreamReport`

- **Firma:** `getIceCreamReport(filters: IceCreamReportFilters): Observable<PaginatedReport<IceCreamReportRow>>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L241) (L241–247)
- **Propósito / descripción:** Unified Reportería de Heladería — `filters.types` selects one or both movements (`sales`, `purchases`), matching `IceCreamReportController`'s checkbox-driven `types` query param. Replaces the former separate ice-cream-sales/ice-cream-purchases report endpoints.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/ice-cream'`
- **Consumidores:** [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts)

##### `ReportsService.getIceCreamReportSummary`

- **Firma:** `getIceCreamReportSummary(filters: IceCreamReportFilters): Observable<IceCreamReportSummary>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L249) (L249–255)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/ice-cream/summary'`
- **Consumidores:** [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts)

##### `ReportsService.exportIceCreamReportPdf`

- **Firma:** `exportIceCreamReportPdf(filters: IceCreamReportFilters): Observable<Blob>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L257) (L257–262)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/ice-cream/export'`
- **Consumidores:** [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts)

##### `ReportsService.getBankMovementsReport`

- **Firma:** `getBankMovementsReport(filters: BankMovementsFilters): Observable<PaginatedBankMovements>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L265) (L265–271)
- **Propósito / descripción:** Historial de movimientos de saldo bancario (admin) — mismo filtro para la lista y el PDF.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/bank-movements'`
- **Consumidores:** [bank-movements-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts)

##### `ReportsService.exportBankMovementsReportPdf`

- **Firma:** `exportBankMovementsReportPdf(filters: BankMovementsFilters): Observable<Blob>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L274) (L274–279)
- **Propósito / descripción:** `responseType: 'blob'` — el backend devuelve el PDF crudo, sin el sobre `{ success, data }`.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/bank-movements/export'`
- **Consumidores:** [bank-movements-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts)

##### `ReportsService.getBankTransfersReport`

- **Firma:** `getBankTransfersReport(filters: BankTransfersReportFilters): Observable<PaginatedBankTransfers>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L282) (L282–286)
- **Propósito / descripción:** Reporte de Transferencias Bancarias (admin): listado paginado.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/bank-transfers'`
- **Consumidores:** [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts)

##### `ReportsService.getBankTransfersReportSummary`

- **Firma:** `getBankTransfersReportSummary(filters: BankTransfersReportFilters): Observable<BankTransfersSummary>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L288) (L288–292)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/bank-transfers/summary'`
- **Consumidores:** [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts)

##### `ReportsService.exportBankTransfersReportPdf`

- **Firma:** `exportBankTransfersReportPdf(filters: BankTransfersReportFilters): Observable<Blob>` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L295) (L295–297)
- **Propósito / descripción:** `responseType: 'blob'` — el backend devuelve el PDF crudo.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/bank-transfers/export'`
- **Consumidores:** [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts)

#### Función `toParams` (L44–52)

- **Tipo:** función local del archivo
- **Firma:** `toParams(filters: object): HttpParams` — [reports.service.ts](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts#L44)
- **Propósito / descripción:** Drops `undefined`/empty-string values — `HttpParams` would otherwise send the literal string `"undefined"` as a query value. An array value (e.g. `types`) stringifies via `Array.prototype.toString` into a comma-separated list, exactly what the backend's `types=a,b` convention expects.
- **Dependencias:** `new HttpParams`, `Object.entries`, `params.set`, `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-role-service-ts"></a>

### role.service.ts

- **Ruta:** [role.service.ts](../../../../comercial-jhoel-app/src/app/core/services/role.service.ts) (`comercial-jhoel-app/src/app/core/services/role.service.ts`, 40 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `RoleService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [role-form-modal.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-form-modal-role-form-modal-component-ts), [roles-page.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts), [users-page.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts)

#### Clase `RoleService` (L10–39)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getRoles` | método public | 15–19 | `includeInactive?` | `Observable<Role[]>` |
| `getRoleById` | método public | 21–23 | `id: string` | `Observable<Role>` |
| `createRole` | método public | 25–27 | `input: CreateRoleInput` | `Observable<Role>` |
| `updateRole` | método public | 29–33 | `id: string`, `input: UpdateRoleInput` | `Observable<Role>` |
| `deleteRole` | método public | 36–38 | `id: string` | `Observable<void>` |

##### `RoleService.getRoles`

- **Firma:** `getRoles(includeInactive?): Observable<Role[]>` — [role.service.ts](../../../../comercial-jhoel-app/src/app/core/services/role.service.ts#L15) (L15–19)
- **Propósito / descripción:** Active-only by default — what the user form's role dropdown should offer.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Role[]>>(BASE_URL, { params: { includeInactive } }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [roles-page.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts), [users-page.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts)

##### `RoleService.getRoleById`

- **Firma:** `getRoleById(id: string): Observable<Role>` — [role.service.ts](../../../../comercial-jhoel-app/src/app/core/services/role.service.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Role>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RoleService.createRole`

- **Firma:** `createRole(input: CreateRoleInput): Observable<Role>` — [role.service.ts](../../../../comercial-jhoel-app/src/app/core/services/role.service.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Role>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [role-form-modal.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-form-modal-role-form-modal-component-ts)

##### `RoleService.updateRole`

- **Firma:** `updateRole(id: string, input: UpdateRoleInput): Observable<Role>` — [role.service.ts](../../../../comercial-jhoel-app/src/app/core/services/role.service.ts#L29) (L29–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<Role>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [role-form-modal.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-components-role-form-modal-role-form-modal-component-ts)

##### `RoleService.deleteRole`

- **Firma:** `deleteRole(id: string): Observable<void>` — [role.service.ts](../../../../comercial-jhoel-app/src/app/core/services/role.service.ts#L36) (L36–38)
- **Propósito / descripción:** Soft delete — the backend deactivates the role, it never deletes the row. Blocked if users are still assigned.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [roles-page.component.ts](dashboard-roles.md#f-comercial-jhoel-app-src-app-features-dashboard-roles-roles-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-sales-cash-box-service-ts"></a>

### sales-cash-box.service.ts

- **Ruta:** [sales-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-cash-box.service.ts) (`comercial-jhoel-app/src/app/core/services/sales-cash-box.service.ts`, 54 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** "Caja de Ventas" por negocio — saldo acumulado independiente + aportes/retiros.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [business-card.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-business-card-business-card-component-ts), [cash-box-movement-modal.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-cash-box-movement-modal-cash-box-movement-modal-component-ts), [sales-register-page.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-sales-register-page-component-ts)

#### Clase `SalesCashBoxService` (L16–53)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** "Caja de Ventas" por negocio — saldo acumulado independiente + aportes/retiros. Mirrors `RechargeCashBoxService`'s own shape.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getBalances` | método public | 21–25 | — | `Observable<SalesCashBoxBalance[]>` |
| `getMovements` | método public | 27–32 | `businessId: string`, `limit?` | `Observable<SalesCashBoxMovement[]>` |
| `registerContribution` | método public | 35–39 | `input: RegisterSalesCashBoxMovementInput` | `Observable<SalesCashBoxMovement>` |
| `registerWithdrawal` | método public | 42–46 | `input: RegisterSalesCashBoxMovementInput` | `Observable<SalesCashBoxMovement>` |
| `voidMovement` | método public | 48–52 | `id: string`, `reason: string` | `Observable<SalesCashBoxMovement>` |

##### `SalesCashBoxService.getBalances`

- **Firma:** `getBalances(): Observable<SalesCashBoxBalance[]>` — [sales-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-cash-box.service.ts#L21) (L21–25)
- **Propósito / descripción:** Saldo de TODOS los negocios activos, en una sola llamada.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<SalesCashBoxBalance[]>>('${BASE_URL}/balances').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/balances'`
- **Consumidores:** [sales-register-page.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-sales-register-page-component-ts)

##### `SalesCashBoxService.getMovements`

- **Firma:** `getMovements(businessId: string, limit?): Observable<SalesCashBoxMovement[]>` — [sales-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-cash-box.service.ts#L27) (L27–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams().set('businessId', businessId).set`, `new HttpParams().set`, `new HttpParams`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/movements'`
- **Consumidores:** [business-card.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-business-card-business-card-component-ts)

##### `SalesCashBoxService.registerContribution`

- **Firma:** `registerContribution(input: RegisterSalesCashBoxMovementInput): Observable<SalesCashBoxMovement>` — [sales-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-cash-box.service.ts#L35) (L35–39)
- **Propósito / descripción:** Admin-only server-side — nunca rechazado por exceder un saldo, solo suma.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/contributions'`
- **Consumidores:** [cash-box-movement-modal.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-cash-box-movement-modal-cash-box-movement-modal-component-ts)

##### `SalesCashBoxService.registerWithdrawal`

- **Firma:** `registerWithdrawal(input: RegisterSalesCashBoxMovementInput): Observable<SalesCashBoxMovement>` — [sales-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-cash-box.service.ts#L42) (L42–46)
- **Propósito / descripción:** Admin-only server-side — el backend valida el saldo disponible de ese negocio de forma atómica; nunca se duplica ese chequeo aquí.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/withdrawals'`
- **Consumidores:** [cash-box-movement-modal.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-cash-box-movement-modal-cash-box-movement-modal-component-ts)

##### `SalesCashBoxService.voidMovement`

- **Firma:** `voidMovement(id: string, reason: string): Observable<SalesCashBoxMovement>` — [sales-cash-box.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-cash-box.service.ts#L48) (L48–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/movements/${id}/void'`
- **Consumidores:** [business-card.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-components-business-card-business-card-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts"></a>

### sales-draft.store.ts

- **Ruta:** [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts) (`comercial-jhoel-app/src/app/core/services/sales-draft.store.ts`, 319 líneas)
- **Tipo:** Store (estado) · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** The in-progress "Ventas" receipt(s), lifted out of `SalesPageComponent` into a root-provided singleton — same reasoning `PurchaseDraftStore` documents for Compras (sidebar indicator without a round-trip, no refetch needed on revisiting the page).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [pdf-prompt-modal.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-pdf-prompt-modal-service-ts), [sales.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-service-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app-update.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-app-update-service-ts), [dashboard-layout.component.ts](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts), [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts), [dashboard-sidebar.component.ts](dashboard-sidebar.md#f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts)

**Interfaces, tipos y enums:**

- `interface SaleDraftState` (L15): One open tab's worth of Ventas state — `sale` is `null` until the first product is added (no server row exists yet for this tab). — miembros: `draftKey`, `sale`, `pendingProductIds`, `isConfiguringPricing`, `isSaving`, `isCancelling`, `invoiceNumberDraft`

#### Clase `SalesDraftStore` (L61–318)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** The in-progress "Ventas" receipt(s), lifted out of `SalesPageComponent` into a root-provided singleton — same reasoning `PurchaseDraftStore` documents for Compras (sidebar indicator without a round-trip, no refetch needed on revisiting the page). **Multiple simultaneous drafts (tabs)**, mirroring Compras: `drafts` holds every open receipt, `activeDraftId` picks which one the page currently shows/edits. Unlike Compras, a Ventas draft IS a real, server-persisted `OPEN` sale with stock already reserved — the backend gained a `draft_key` column specifically so one user can now own several such rows at once (see the API's own `AddDraftKeyToSales` migration), each identified by the client-generated key this store assigns per tab. Closing a tab that already reserved stock is therefore never a purely local operation the way it is in Compras — it always goes through `SalesService.cancelSale(draft
- **Servicios inyectados con `inject()`:** `salesService = inject(SalesService)`, `notificationService = inject(NotificationService)`, `pdfPromptModalService = inject(PdfPromptModalService)`
- **Datos / estado que administra:** `drafts = signal<SaleDraftState[]>([makeBlankDraft()])`, `activeDraftId = signal<string>(this.drafts()[0].draftKey)`, `loaded = signal(false)`, `activeDraft = computed( () => this.drafts().find((d) => d.draftK`, `items = computed(() => this.activeDraft().sale?.items ?? [`, `total = computed(() => this.activeDraft().sale?.total ?? 0`, `invoiceNumberDraft = computed(() => this.activeDraft().invoiceNumberDra`, `clientId = computed(() => this.activeDraft().sale?.clientId ?`, `clientName = computed(() => this.activeDraft().sale?.clientName`, `priceList = computed<PriceListType>(() => this.activeDraft().s`, `pendingProductIds = computed(() => this.activeDraft().pendingProductId`, `isConfiguringPricing = computed(() => this.activeDraft().isConfiguringPri`, `isSaving = computed(() => this.activeDraft().isSaving)`, `isCancelling = computed(() => this.activeDraft().isCancelling)`, `hasActiveDraft = computed(() => this.drafts().some((d) => (d.sale?.`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `setInvoiceNumberDraft` | método public | 80–82 | `invoiceNumber: string` | `void` |
| `restore` | método private | 98–116 | — | `void` |
| `updateDraft` | método private | 118–120 | `draftKey: string`, `updater: (draft: SaleDraftState) => SaleDraftState` | `void` |
| `openNewDraft` | método public | 124–128 | — | `void` |
| `setActiveDraft` | método public | 130–134 | `draftKey: string` | `void` |
| `removeDraftLocally` | método private | 144–151 | `draftKey: string` | `void` |
| `closeDraftWithoutServerRow` | método public | 162–167 | `draftKey: string` | `void` |
| `onProductSelected` | método public | 169–171 | `product: Product` | `void` |
| `onQuantityChange` | método public | 173–184 | `change: { productId: string; quantity: number }` | `void` |
| `onRemoveItem` | método public | 186–193 | `productId: string` | `void` |
| `adjustItem` | método private | 195–224 | `draftKey: string`, `productId: string`, `quantityDelta: number`, `productName: string` | `void` |
| `withoutId` | método private | 226–230 | `ids: Set<string>`, `id: string` | `Set<string>` |
| `configurePricing` | método public | 238–256 | `clientId: string \| null`, `priceList: PriceListType` | `void` |
| `confirmSale` | método public | 259–283 | — | `void` |
| `cancelDraft` | método public | 286–303 | `draftKey: string` | `void` |
| `resetOnLogout` | método public | 313–317 | — | `void` |

##### `SalesDraftStore.setInvoiceNumberDraft`

- **Firma:** `setInvoiceNumberDraft(invoiceNumber: string): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.updateDraft`, `this.activeDraftId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesDraftStore.restore`

- **Firma:** `restore(): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L98) (L98–116)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.salesService.getCurrentSales().subscribe`, `this.salesService.getCurrentSales`, `this.drafts.set`, `sales.map`, `newDraftId`, `new Set`, `this.activeDraftId.set`, `this.drafts`, `this.loaded.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.drafts.set`, `this.activeDraftId.set`, `this.loaded.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesDraftStore.updateDraft`

- **Firma:** `updateDraft(draftKey: string, updater: (draft: SaleDraftState) => SaleDraftState): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L118) (L118–120)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.drafts.update`, `drafts.map`, `updater`
- **Efectos secundarios:** Actualiza estado (signals): `this.drafts.update`
- **Consumidores:** (mismo archivo)

##### `SalesDraftStore.openNewDraft`

- **Firma:** `openNewDraft(): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L124) (L124–128)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `makeBlankDraft`, `this.drafts.update`, `this.activeDraftId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.drafts.update`, `this.activeDraftId.set`
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts)

##### `SalesDraftStore.setActiveDraft`

- **Firma:** `setActiveDraft(draftKey: string): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L130) (L130–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.drafts().some`, `this.drafts`, `this.activeDraftId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeDraftId.set`
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts)

##### `SalesDraftStore.removeDraftLocally`

- **Firma:** `removeDraftLocally(draftKey: string): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L144) (L144–151)
- **Propósito / descripción:** Removes a tab locally only — never releases stock on its own; only `closeDraftWithoutServerRow()`/`cancelDraft()`/`confirmSale()` (below) are the sanctioned ways to actually remove a tab, since only they know whether a network call was needed first. Never leaves zero tabs: closing the last remaining one replaces it with a fresh blank draft instead of ever emptying the array.
- **Dependencias (llamadas en su cuerpo):** `this.drafts().filter`, `this.drafts`, `makeBlankDraft`, `this.drafts.set`, `nextDrafts.some`, `this.activeDraftId`, `this.activeDraftId.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.drafts.set`, `this.activeDraftId.set`
- **Consumidores:** (mismo archivo)

##### `SalesDraftStore.closeDraftWithoutServerRow`

- **Firma:** `closeDraftWithoutServerRow(draftKey: string): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L162) (L162–167)
- **Propósito / descripción:** A tab whose `sale` is still `null` never created a server-side row at all (no product was ever added to it) — there is nothing to cancel, so closing it is purely local. Any tab whose `sale` is non-`null` (including one with zero current items, e.g. every line was added then removed again) still has a real `OPEN` row server-side and must go through `cancelDraft()` instead, never this method — see `SalesPageComponent.requestCloseTab()` for the decision between the two.
- **Dependencias (llamadas en su cuerpo):** `this.drafts().find`, `this.drafts`, `this.removeDraftLocally`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts)

##### `SalesDraftStore.onProductSelected`

- **Firma:** `onProductSelected(product: Product): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L169) (L169–171)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.adjustItem`, `this.activeDraftId`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts)

##### `SalesDraftStore.onQuantityChange`

- **Firma:** `onQuantityChange(change: { productId: string; quantity: number }): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L173) (L173–184)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.activeDraftId`, `this.items().find`, `this.items`, `this.adjustItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts)

##### `SalesDraftStore.onRemoveItem`

- **Firma:** `onRemoveItem(productId: string): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L186) (L186–193)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.activeDraftId`, `this.items().find`, `this.items`, `this.adjustItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts)

##### `SalesDraftStore.adjustItem`

- **Firma:** `adjustItem(draftKey: string, productId: string, quantityDelta: number, productName: string): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L195) (L195–224)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.drafts().find`, `this.drafts`, `draft.pendingProductIds.has`, `this.updateDraft`, `new Set(d.pendingProductIds).add`, `new Set`, `this.salesService.adjustSaleItem(productId, quantityDelta, draftKey).subscribe`, `this.salesService.adjustSaleItem`, `this.withoutId`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `SalesDraftStore.withoutId`

- **Firma:** `withoutId(ids: Set<string>, id: string): Set<string>` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L226) (L226–230)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Set`, `next.delete`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `SalesDraftStore.configurePricing`

- **Firma:** `configurePricing(clientId: string \| null, priceList: PriceListType): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L238) (L238–256)
- **Propósito / descripción:** Sets/updates the client and price list for whichever tab is active — called once, before or while that tab's cart is empty. Rejected by the backend (and surfaced as a toast) if that receipt already has line items and the price list would change.
- **Dependencias (llamadas en su cuerpo):** `this.activeDraftId`, `this.isConfiguringPricing`, `this.updateDraft`, `this.salesService.configurePricing(clientId, priceList, draftKey).subscribe`, `this.salesService.configurePricing`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts)

##### `SalesDraftStore.confirmSale`

- **Firma:** `confirmSale(): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L259) (L259–283)
- **Propósito / descripción:** "Guardar venta" for whichever tab is active — on success, that tab closes (or resets to blank if it was the only one); every other open tab is untouched.
- **Dependencias (llamadas en su cuerpo):** `this.activeDraftId`, `this.drafts().find`, `this.drafts`, `draft.invoiceNumberDraft.trim`, `this.updateDraft`, `this.salesService.confirmSale(draftKey, invoiceNumber).subscribe`, `this.salesService.confirmSale`, `this.removeDraftLocally`, `this.notificationService.success`, `this.pdfPromptModalService.prompt`, `this.salesService.exportSalePdf`, `sale.id.slice`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts)

##### `SalesDraftStore.cancelDraft`

- **Firma:** `cancelDraft(draftKey: string): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L286) (L286–303)
- **Propósito / descripción:** Discards the targeted tab's receipt — restores every reserved line's stock, then removes that tab locally. Every other open tab is untouched.
- **Dependencias (llamadas en su cuerpo):** `this.drafts().find`, `this.drafts`, `this.updateDraft`, `this.salesService.cancelSale(draftKey).subscribe`, `this.salesService.cancelSale`, `this.removeDraftLocally`, `this.notificationService.warning`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [sales-page.component.ts](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-sales-page-component-ts)

##### `SalesDraftStore.resetOnLogout`

- **Firma:** `resetOnLogout(): void` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L313) (L313–317)
- **Propósito / descripción:** Client-side only — clears the in-memory signals so a different user logging in on the same tab never sees a flash of this one's receipts. Deliberately never calls `cancelSale()` for any draft: every actual `OPEN` sale stays reserved on the server for its owner and is restored exactly as it was the next time they log back in and this store re-runs `getCurrentSales()`.
- **Dependencias (llamadas en su cuerpo):** `this.drafts.set`, `makeBlankDraft`, `this.activeDraftId.set`, `this.drafts`, `this.loaded.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.drafts.set`, `this.activeDraftId.set`, `this.loaded.set`
- **Consumidores:** [dashboard-layout.component.ts](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts)

#### Función `newDraftId` (L10–12)

- **Tipo:** función local del archivo
- **Firma:** `newDraftId(): string` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L10)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `crypto.randomUUID`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `makeBlankDraft` (L26–36)

- **Tipo:** función local del archivo
- **Firma:** `makeBlankDraft(): SaleDraftState` — [sales-draft.store.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts#L26)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `newDraftId`, `new Set`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-sales-register-service-ts"></a>

### sales-register.service.ts

- **Ruta:** [sales-register.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-register.service.ts) (`comercial-jhoel-app/src/app/core/services/sales-register.service.ts`, 22 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Talks to `${environment.apiUrl}/sales-register` — "Gestión de Caja de Ventas", read-only.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [sales-register-page.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-sales-register-page-component-ts)

#### Clase `SalesRegisterService` (L9–21)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Talks to `${environment.apiUrl}/sales-register` — "Gestión de Caja de Ventas", read-only.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSummary` | método public | 14–20 | `date?: string` | `Observable<SalesRegisterSummary>` |

##### `SalesRegisterService.getSummary`

- **Firma:** `getSummary(date?: string): Observable<SalesRegisterSummary>` — [sales-register.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales-register.service.ts#L14) (L14–20)
- **Propósito / descripción:** `date` — `yyyy-MM-dd`, omit for today (server-resolved, `America/Guatemala`).
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${environment.apiUrl}/sales-register/summary'`
- **Consumidores:** [sales-register-page.component.ts](dashboard-sales-register.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-register-sales-register-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-sales-service-ts"></a>

### sales.service.ts

- **Ruta:** [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts) (`comercial-jhoel-app/src/app/core/services/sales.service.ts`, 139 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `SalesService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts), [sales-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-daily-chart-sales-daily-chart-component-ts), [sales-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-weekly-chart-sales-weekly-chart-component-ts), [sales-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-yearly-chart-sales-yearly-chart-component-ts), [sale-detail-modal.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-components-sale-detail-modal-sale-detail-modal-component-ts), [sales-admin-page.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-sales-admin-page-component-ts)

#### Clase `SalesService` (L20–138)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `createSale` | método public | 29–31 | `input: CreateSaleInput` | `Observable<Sale>` |
| `getSales` | método public | 34–46 | `filters?: ListSalesFilters` | `Observable<PaginatedResponse<Sale>>` |
| `getSaleById` | método public | 48–50 | `id: string` | `Observable<Sale>` |
| `adjustSaleItem` | método public | 59–63 | `productId: string`, `quantityDelta: number`, `draftKey: string` | `Observable<Sale>` |
| `getCurrentSales` | método public | 71–76 | — | `Observable<Sale[]>` |
| `confirmSale` | método public | 79–83 | `draftKey: string`, `invoiceNumber?: string` | `Observable<Sale>` |
| `cancelSale` | método public | 86–88 | `draftKey: string` | `Observable<void>` |
| `configurePricing` | método public | 96–104 | `clientId: string \| null`, `priceList: PriceListType`, `draftKey: string` | `Observable<Sale>` |
| `exportSalePdf` | método public | 107–109 | `id: string` | `Observable<Blob>` |
| `voidSale` | método public | 112–116 | `id: string`, `reason: string` | `Observable<Sale>` |
| `getDailyStats` | método public | 119–123 | — | `Observable<SalesDailyStats>` |
| `getWeeklyStats` | método public | 126–130 | — | `Observable<SalesWeeklyStats>` |
| `getYearlyStats` | método public | 133–137 | — | `Observable<SalesYearlyStats>` |

##### `SalesService.createSale`

- **Firma:** `createSale(input: CreateSaleInput): Observable<Sale>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L29) (L29–31)
- **Propósito / descripción:** Bulk, one-shot sale creation — kept for other callers (see `Sale.createSale` in `core/models/sale.model.ts`). The Ventas screen itself uses the real-time draft flow below instead.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Sale>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SalesService.getSales`

- **Firma:** `getSales(filters?: ListSalesFilters): Observable<PaginatedResponse<Sale>>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L34) (L34–46)
- **Propósito / descripción:** A USER account only ever gets their own sales back — the backend decides that, not this call. An admin (e.g. "Administrar Facturas de Ventas") sees every sale, filtered by whatever `filters` carries.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams`, `Object.entries`, `params.set`, `String`, `this.http.get<ApiSuccessResponse<PaginatedResponse<Sale>>>(BASE_URL, { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [sales-admin-page.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-sales-admin-page-component-ts)

##### `SalesService.getSaleById`

- **Firma:** `getSaleById(id: string): Observable<Sale>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L48) (L48–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Sale>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [sale-detail-modal.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-components-sale-detail-modal-sale-detail-modal-component-ts)

##### `SalesService.adjustSaleItem`

- **Firma:** `adjustSaleItem(productId: string, quantityDelta: number, draftKey: string): Observable<Sale>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L59) (L59–63)
- **Propósito / descripción:** Reserves (positive `quantityDelta`) or releases (negative) stock against one specific open receipt (`draftKey` — one per open tab), in real time — creates that draft's server-side row on its first call. Returns the full updated draft so the UI always renders exactly what the backend actually committed, never an optimistic local guess.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/items'`
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts)

##### `SalesService.getCurrentSales`

- **Firma:** `getCurrentSales(): Observable<Sale[]>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L71) (L71–76)
- **Propósito / descripción:** Every one of the caller's currently open receipts (one per open tab) — an empty array (not a thrown error) whenever there are none, so a page load never needs to special-case "nothing in progress": either way, the Ventas screen just starts from a single empty tab.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Sale[]>>('${BASE_URL}/current').pipe`, `this.http.get`, `map`, `catchError`, `of`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/current'`
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts)

##### `SalesService.confirmSale`

- **Firma:** `confirmSale(draftKey: string, invoiceNumber?: string): Observable<Sale>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L79) (L79–83)
- **Propósito / descripción:** "Guardar venta" — stock was already reserved as items were added; this only finalizes the targeted tab's receipt. `invoiceNumber` is optional.
- **Dependencias (llamadas en su cuerpo):** `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/confirm'`
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts)

##### `SalesService.cancelSale`

- **Firma:** `cancelSale(draftKey: string): Observable<void>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L86) (L86–88)
- **Propósito / descripción:** Discards the targeted tab's in-progress receipt — every reserved line's stock is restored.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/current'`
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts)

##### `SalesService.configurePricing`

- **Firma:** `configurePricing(clientId: string \| null, priceList: PriceListType, draftKey: string): Observable<Sale>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L96) (L96–104)
- **Propósito / descripción:** Sets/updates one open receipt's client and price list — call once per tab, before or while that tab's cart is empty. The backend rejects a price-list change once that receipt has line items (`clientId: null` clears the client, which is always allowed).
- **Dependencias (llamadas en su cuerpo):** `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/current/pricing'`
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts)

##### `SalesService.exportSalePdf`

- **Firma:** `exportSalePdf(id: string): Observable<Blob>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L107) (L107–109)
- **Propósito / descripción:** Reconstructs the receipt PDF purely from the already-persisted sale — never re-runs the save.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}/pdf'`
- **Consumidores:** [sales-draft.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-sales-draft-store-ts)

##### `SalesService.voidSale`

- **Firma:** `voidSale(id: string, reason: string): Observable<Sale>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L112) (L112–116)
- **Propósito / descripción:** "Anular venta" — admin-only server-side; never a physical delete/edit, marks the sale `ANULADA` and reverses its exact inventory effect atomically.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Sale>>('${BASE_URL}/${id}/void', { reason }).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/void'`
- **Consumidores:** [sales-admin-page.component.ts](dashboard-sales-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-admin-sales-admin-page-component-ts)

##### `SalesService.getDailyStats`

- **Firma:** `getDailyStats(): Observable<SalesDailyStats>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L119) (L119–123)
- **Propósito / descripción:** Open to any authenticated account — backs "Ventas del mes" en Gráficas → Indicadores de Ventas, siempre el mes actual del servidor.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<SalesDailyStats>>('${BASE_URL}/daily-stats').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/daily-stats'`
- **Consumidores:** [sales-daily-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-daily-chart-sales-daily-chart-component-ts)

##### `SalesService.getWeeklyStats`

- **Firma:** `getWeeklyStats(): Observable<SalesWeeklyStats>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L126) (L126–130)
- **Propósito / descripción:** Open to any authenticated account — backs "Ventas por semana".
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<SalesWeeklyStats>>('${BASE_URL}/weekly-stats').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/weekly-stats'`
- **Consumidores:** [sales-weekly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-weekly-chart-sales-weekly-chart-component-ts)

##### `SalesService.getYearlyStats`

- **Firma:** `getYearlyStats(): Observable<SalesYearlyStats>` — [sales.service.ts](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts#L133) (L133–137)
- **Propósito / descripción:** Open to any authenticated account — backs "Ventas por mes" (anual).
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<SalesYearlyStats>>('${BASE_URL}/yearly-stats').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/yearly-stats'`
- **Consumidores:** [sales-yearly-chart.component.ts](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-yearly-chart-sales-yearly-chart-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-site-visits-service-ts"></a>

### site-visits.service.ts

- **Ruta:** [site-visits.service.ts](../../../../comercial-jhoel-app/src/app/core/services/site-visits.service.ts) (`comercial-jhoel-app/src/app/core/services/site-visits.service.ts`, 40 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Contador anónimo y agregado de visitas a la landing pública — el backend es la única fuente de verdad (nunca `localStorage`/`sessionStorage`/ cookies).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [footer.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-footer-footer-component-ts)

**Interfaces, tipos y enums:**

- `interface VisitCount` (L10): sin documentación — miembros: `total`

#### Clase `SiteVisitsService` (L23–39)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Contador anónimo y agregado de visitas a la landing pública — el backend es la única fuente de verdad (nunca `localStorage`/`sessionStorage`/ cookies). `registerVisit()` se llama UNA vez por carga real de la landing (ver `LandingPageComponent`, que solo se construye al navegar A la ruta `/`, nunca al desplazarse entre anchors dentro de ella) — nunca aquí mismo, para no arriesgar una doble llamada si este servicio llegara a inyectarse en más de un lugar.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `registerVisit` | método public | 28–32 | — | `Observable<VisitCount>` |
| `getVisitCount` | método public | 34–38 | — | `Observable<VisitCount>` |

##### `SiteVisitsService.registerVisit`

- **Firma:** `registerVisit(): Observable<VisitCount>` — [site-visits.service.ts](../../../../comercial-jhoel-app/src/app/core/services/site-visits.service.ts#L28) (L28–32)
- **Propósito / descripción:** Suma +1 en el backend — el frontend nunca envía ni puede fijar un total.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<VisitCount>>(BASE_URL, {}).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SiteVisitsService.getVisitCount`

- **Firma:** `getVisitCount(): Observable<VisitCount>` — [site-visits.service.ts](../../../../comercial-jhoel-app/src/app/core/services/site-visits.service.ts#L34) (L34–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<VisitCount>>(BASE_URL).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-stats-service-ts"></a>

### stats.service.ts

- **Ruta:** [stats.service.ts](../../../../comercial-jhoel-app/src/app/core/services/stats.service.ts) (`comercial-jhoel-app/src/app/core/services/stats.service.ts`, 19 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Credibility metrics shown right under the hero.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [credibility.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-credibility-credibility-component-ts)

#### Clase `StatsService` (L13–18)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Credibility metrics shown right under the hero. Phase 2: replace the `of(STATS)` body with a real endpoint, e.g. `this.http.get&lt;StatItem[]&gt;(\`${environment.apiUrl}/stats\`)`.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getStats` | método public | 15–17 | — | `Observable<StatItem[]>` |

##### `StatsService.getStats`

- **Firma:** `getStats(): Observable<StatItem[]>` — [stats.service.ts](../../../../comercial-jhoel-app/src/app/core/services/stats.service.ts#L15) (L15–17)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `of`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-supplier-service-ts"></a>

### supplier.service.ts

- **Ruta:** [supplier.service.ts](../../../../comercial-jhoel-app/src/app/core/services/supplier.service.ts) (`comercial-jhoel-app/src/app/core/services/supplier.service.ts`, 48 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `SupplierService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [ice-cream-purchases-page.component.ts](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-ice-cream-purchases-page-component-ts), [purchases-page.component.ts](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-purchases-page-component-ts), [purchases-admin-page.component.ts](dashboard-purchases-admin.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-admin-purchases-admin-page-component-ts), [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [supplier-form-modal.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-form-modal-supplier-form-modal-component-ts), [suppliers-page.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts)

#### Clase `SupplierService` (L10–47)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getSuppliers` | método public | 19–27 | `includeInactive?`, `search?: string` | `Observable<Supplier[]>` |
| `getSupplierById` | método public | 29–31 | `id: string` | `Observable<Supplier>` |
| `createSupplier` | método public | 33–35 | `input: SupplierInput` | `Observable<Supplier>` |
| `updateSupplier` | método public | 37–41 | `id: string`, `input: SupplierInput` | `Observable<Supplier>` |
| `deleteSupplier` | método public | 44–46 | `id: string` | `Observable<void>` |

##### `SupplierService.getSuppliers`

- **Firma:** `getSuppliers(includeInactive?, search?: string): Observable<Supplier[]>` — [supplier.service.ts](../../../../comercial-jhoel-app/src/app/core/services/supplier.service.ts#L19) (L19–27)
- **Propósito / descripción:** Active-only by default — what the purchase form's dropdown should offer. `search` is forwarded to the backend's accent/case-insensitive `search_normalize()`-based match (name/taxId/phone) — never filtered here in JS.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Supplier[]>>(BASE_URL, { params }).pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [suppliers-page.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts)

##### `SupplierService.getSupplierById`

- **Firma:** `getSupplierById(id: string): Observable<Supplier>` — [supplier.service.ts](../../../../comercial-jhoel-app/src/app/core/services/supplier.service.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Supplier>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `SupplierService.createSupplier`

- **Firma:** `createSupplier(input: SupplierInput): Observable<Supplier>` — [supplier.service.ts](../../../../comercial-jhoel-app/src/app/core/services/supplier.service.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Supplier>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [supplier-form-modal.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-form-modal-supplier-form-modal-component-ts)

##### `SupplierService.updateSupplier`

- **Firma:** `updateSupplier(id: string, input: SupplierInput): Observable<Supplier>` — [supplier.service.ts](../../../../comercial-jhoel-app/src/app/core/services/supplier.service.ts#L37) (L37–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<Supplier>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [supplier-form-modal.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-components-supplier-form-modal-supplier-form-modal-component-ts)

##### `SupplierService.deleteSupplier`

- **Firma:** `deleteSupplier(id: string): Observable<void>` — [supplier.service.ts](../../../../comercial-jhoel-app/src/app/core/services/supplier.service.ts#L44) (L44–46)
- **Propósito / descripción:** Soft delete — the backend deactivates the supplier, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [suppliers-page.component.ts](dashboard-suppliers.md#f-comercial-jhoel-app-src-app-features-dashboard-suppliers-suppliers-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-theme-service-ts"></a>

### theme.service.ts

- **Ruta:** [theme.service.ts](../../../../comercial-jhoel-app/src/app/core/services/theme.service.ts) (`comercial-jhoel-app/src/app/core/services/theme.service.ts`, 144 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** The single source of truth for "Light Mode / Dark Mode" across the frontend — no component should read or write the `data-theme` attribute or `localStorage` directly; everything goes through here (see the toggle button in `DashboardTopbarComponent`).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [dashboard-topbar.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-dashboard-topbar-component-ts)

#### Clase `ThemeService` (L30–143)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** The single source of truth for "Light Mode / Dark Mode" across the frontend — no component should read or write the `data-theme` attribute or `localStorage` directly; everything goes through here (see the toggle button in `DashboardTopbarComponent`). The database (the authenticated user's own preference) is the real source of truth — `localStorage` is only a cache used to paint the correct theme immediately on app load (avoiding a light→dark flash while the `GET /users/me/preferences` call is still in flight) and is never consulted again after boot. `AuthService` decides WHEN to call `loadUserTheme()` (after `restoreSession()` and after a successful login) — this service knows nothing about authentication itself; `authInterceptor` already attaches the JWT to any call to `environment.apiUrl` automatically.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `theme = signal<ThemePreference>(this.readCachedTheme())`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `preferencesUrl` | getter private | 50–52 | — | `string` |
| `updateThemeUrl` | getter private | 54–56 | — | `string` |
| `getTheme` | método public | 72–74 | — | `ThemePreference` |
| `setTheme` | método public | 83–100 | `theme: ThemePreference` | `void` |
| `loadUserTheme` | método public | 109–117 | — | `void` |
| `reset` | método public | 120–124 | — | `void` |
| `applyAndCache` | método private | 126–130 | `theme: ThemePreference` | `void` |
| `applyTheme` | método private | 132–134 | `theme: ThemePreference` | `void` |
| `readCachedTheme` | método private | 136–138 | — | `ThemePreference` |
| `hasSession` | método private | 140–142 | — | `boolean` |

##### `ThemeService.preferencesUrl`

- **Firma:** `preferencesUrl(): string` — [theme.service.ts](../../../../comercial-jhoel-app/src/app/core/services/theme.service.ts#L50) (L50–52)
- **Propósito / descripción:** Computed per call, never a module-scope `const` — `ThemeService` is imported eagerly (`AuthService` → `ThemeService`, needed so the constructor above can apply the cached theme immediately), which means its module evaluates as part of `main.ts`'s own eager import chain, BEFORE `main.ts`'s own body runs `environment.apiUrl = resolveApiUrl()`. A `const X = \`${environment.apiUrl}/...\`` here would freeze the placeholder compiled into `environment.ts`, permanently ignoring the real backend URL resolved at runtime (Codespaces/Railway/manual override) — confirmed live in production: every other request-URL pattern in this app already reads `environment.apiUrl` inside a method body for this exact 
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ThemeService.updateThemeUrl`

- **Firma:** `updateThemeUrl(): string` — [theme.service.ts](../../../../comercial-jhoel-app/src/app/core/services/theme.service.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ThemeService.getTheme`

- **Firma:** `getTheme(): ThemePreference` — [theme.service.ts](../../../../comercial-jhoel-app/src/app/core/services/theme.service.ts#L72) (L72–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.theme`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ThemeService.setTheme`

- **Firma:** `setTheme(theme: ThemePreference): void` — [theme.service.ts](../../../../comercial-jhoel-app/src/app/core/services/theme.service.ts#L83) (L83–100)
- **Propósito / descripción:** Optimistic update: applies and caches immediately (the whole app reacts to the signal in the same tick), then persists to the backend. If the save fails, it visually reverts to the previous value and notifies — the frontend is never left "believing" a theme the backend never actually accepted.
- **Dependencias (llamadas en su cuerpo):** `this.theme`, `this.applyAndCache`, `this.http.patch`, `catchError`, `this.notificationService.error`, `of`
- **Efectos secundarios:** HTTP: PATCH `this.updateThemeUrl`
- **Consumidores:** [dashboard-topbar.component.ts](dashboard-topbar.md#f-comercial-jhoel-app-src-app-features-dashboard-topbar-dashboard-topbar-component-ts)

##### `ThemeService.loadUserTheme`

- **Firma:** `loadUserTheme(): void` — [theme.service.ts](../../../../comercial-jhoel-app/src/app/core/services/theme.service.ts#L109) (L109–117)
- **Propósito / descripción:** "The backend takes priority" on login — called from `AuthService` after restoring a session and after a successful login, never from a UI component. A network failure here just leaves the cached theme as it was (a possibly stale preference is better than no theme applied at all).
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<ThemePreferencesResponse>>(this.preferencesUrl).pipe`, `this.http.get`, `tap`, `this.applyAndCache`, `catchError`, `of`
- **Efectos secundarios:** HTTP: GET `this.preferencesUrl`
- **Consumidores:** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts)

##### `ThemeService.reset`

- **Firma:** `reset(): void` — [theme.service.ts](../../../../comercial-jhoel-app/src/app/core/services/theme.service.ts#L120) (L120–124)
- **Propósito / descripción:** Called by `AuthService.logout()` — removes the document attribute immediately so the public site never inherits the dark theme of the session that just ended.
- **Dependencias (llamadas en su cuerpo):** `this.theme.set`, `localStorage.removeItem`, `document.documentElement.removeAttribute`
- **Efectos secundarios:** Actualiza estado (signals): `this.theme.set`
- **Consumidores:** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts)

##### `ThemeService.applyAndCache`

- **Firma:** `applyAndCache(theme: ThemePreference): void` — [theme.service.ts](../../../../comercial-jhoel-app/src/app/core/services/theme.service.ts#L126) (L126–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.theme.set`, `this.applyTheme`, `localStorage.setItem`
- **Efectos secundarios:** Actualiza estado (signals): `this.theme.set`
- **Consumidores:** (mismo archivo)

##### `ThemeService.applyTheme`

- **Firma:** `applyTheme(theme: ThemePreference): void` — [theme.service.ts](../../../../comercial-jhoel-app/src/app/core/services/theme.service.ts#L132) (L132–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `document.documentElement.setAttribute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `ThemeService.readCachedTheme`

- **Firma:** `readCachedTheme(): ThemePreference` — [theme.service.ts](../../../../comercial-jhoel-app/src/app/core/services/theme.service.ts#L136) (L136–138)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `localStorage.getItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ThemeService.hasSession`

- **Firma:** `hasSession(): boolean` — [theme.service.ts](../../../../comercial-jhoel-app/src/app/core/services/theme.service.ts#L140) (L140–142)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `localStorage.getItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-core-services-tickets-service-ts"></a>

### tickets.service.ts

- **Ruta:** [tickets.service.ts](../../../../comercial-jhoel-app/src/app/core/services/tickets.service.ts) (`comercial-jhoel-app/src/app/core/services/tickets.service.ts`, 52 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** A Ticket is explicitly NOT a real sale — this service only ever calls `/tickets`, never `/sales` or `/inventory`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [create-ticket-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-create-ticket-tab-create-ticket-tab-component-ts), [ticket-detail-modal.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-detail-modal-ticket-detail-modal-component-ts), [ticket-history-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts)

#### Clase `TicketsService` (L18–51)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** A Ticket is explicitly NOT a real sale — this service only ever calls `/tickets`, never `/sales` or `/inventory`.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `createTicket` | método public | 22–24 | `input: CreateTicketInput` | `Observable<Ticket>` |
| `getTickets` | método public | 26–36 | `query?: ListTicketsQuery` | `Observable<PaginatedResponse<TicketSummary>>` |
| `getTicketById` | método public | 38–40 | `id: string` | `Observable<Ticket>` |
| `exportTicketPdf` | método public | 42–44 | `id: string` | `Observable<Blob>` |
| `voidTicket` | método public | 46–50 | `id: string`, `reason: string` | `Observable<Ticket>` |

##### `TicketsService.createTicket`

- **Firma:** `createTicket(input: CreateTicketInput): Observable<Ticket>` — [tickets.service.ts](../../../../comercial-jhoel-app/src/app/core/services/tickets.service.ts#L22) (L22–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Ticket>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [create-ticket-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-create-ticket-tab-create-ticket-tab-component-ts)

##### `TicketsService.getTickets`

- **Firma:** `getTickets(query?: ListTicketsQuery): Observable<PaginatedResponse<TicketSummary>>` — [tickets.service.ts](../../../../comercial-jhoel-app/src/app/core/services/tickets.service.ts#L26) (L26–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new HttpParams`, `Object.entries`, `params.set`, `String`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [ticket-history-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts)

##### `TicketsService.getTicketById`

- **Firma:** `getTicketById(id: string): Observable<Ticket>` — [tickets.service.ts](../../../../comercial-jhoel-app/src/app/core/services/tickets.service.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<Ticket>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** [ticket-detail-modal.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-detail-modal-ticket-detail-modal-component-ts)

##### `TicketsService.exportTicketPdf`

- **Firma:** `exportTicketPdf(id: string): Observable<Blob>` — [tickets.service.ts](../../../../comercial-jhoel-app/src/app/core/services/tickets.service.ts#L42) (L42–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}/pdf'`
- **Consumidores:** [create-ticket-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-create-ticket-tab-create-ticket-tab-component-ts), [ticket-history-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts)

##### `TicketsService.voidTicket`

- **Firma:** `voidTicket(id: string, reason: string): Observable<Ticket>` — [tickets.service.ts](../../../../comercial-jhoel-app/src/app/core/services/tickets.service.ts#L46) (L46–50)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<Ticket>>('${BASE_URL}/${id}/void', { reason }).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/void'`
- **Consumidores:** [ticket-history-tab.component.ts](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-history-tab-ticket-history-tab-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-transaction-bank-service-ts"></a>

### transaction-bank.service.ts

- **Ruta:** [transaction-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-bank.service.ts) (`comercial-jhoel-app/src/app/core/services/transaction-bank.service.ts`, 68 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** URL pública del logo (un `&lt;img&gt;` no puede mandar el token), o `null` si no tiene.
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [bank-picker-modal.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaction-bank-form-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-form-modal-transaction-bank-form-modal-component-ts), [transaction-bank-image-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-image-modal-transaction-bank-image-modal-component-ts), [transaction-bank-table.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-table-transaction-bank-table-component-ts), [transaction-banks-page.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts)

#### Clase `TransactionBankService` (L11–59)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getTransactionBanks` | método public | 16–20 | `includeInactive?` | `Observable<TransactionBank[]>` |
| `getTransactionBankById` | método public | 22–26 | `id: string` | `Observable<TransactionBank>` |
| `createTransactionBank` | método public | 28–32 | `input: TransactionBankInput` | `Observable<TransactionBank>` |
| `updateTransactionBank` | método public | 34–38 | `id: string`, `input: TransactionBankInput` | `Observable<TransactionBank>` |
| `deleteTransactionBank` | método public | 41–43 | `id: string` | `Observable<void>` |
| `setImage` | método public | 46–52 | `id: string`, `file: File` | `Observable<TransactionBank>` |
| `removeImage` | método public | 54–58 | `id: string` | `Observable<TransactionBank>` |

##### `TransactionBankService.getTransactionBanks`

- **Firma:** `getTransactionBanks(includeInactive?): Observable<TransactionBank[]>` — [transaction-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-bank.service.ts#L16) (L16–20)
- **Propósito / descripción:** Active-only by default — what Transaccionar's bank dropdown should offer.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [transaction-banks-page.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts)

##### `TransactionBankService.getTransactionBankById`

- **Firma:** `getTransactionBankById(id: string): Observable<TransactionBank>` — [transaction-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-bank.service.ts#L22) (L22–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<TransactionBank>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionBankService.createTransactionBank`

- **Firma:** `createTransactionBank(input: TransactionBankInput): Observable<TransactionBank>` — [transaction-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-bank.service.ts#L28) (L28–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<TransactionBank>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [transaction-bank-form-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-form-modal-transaction-bank-form-modal-component-ts)

##### `TransactionBankService.updateTransactionBank`

- **Firma:** `updateTransactionBank(id: string, input: TransactionBankInput): Observable<TransactionBank>` — [transaction-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-bank.service.ts#L34) (L34–38)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<TransactionBank>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [transaction-bank-form-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-form-modal-transaction-bank-form-modal-component-ts)

##### `TransactionBankService.deleteTransactionBank`

- **Firma:** `deleteTransactionBank(id: string): Observable<void>` — [transaction-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-bank.service.ts#L41) (L41–43)
- **Propósito / descripción:** Soft delete — the backend deactivates the banco agente, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [transaction-banks-page.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-transaction-banks-page-component-ts)

##### `TransactionBankService.setImage`

- **Firma:** `setImage(id: string, file: File): Observable<TransactionBank>` — [transaction-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-bank.service.ts#L46) (L46–52)
- **Propósito / descripción:** Sube/reemplaza el logo (JPG/PNG/WEBP, máx. 5 MB) — devuelve el banco ya actualizado.
- **Dependencias (llamadas en su cuerpo):** `new FormData`, `formData.set`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `'${BASE_URL}/${id}/image'`
- **Consumidores:** [transaction-bank-image-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-image-modal-transaction-bank-image-modal-component-ts)

##### `TransactionBankService.removeImage`

- **Firma:** `removeImage(id: string): Observable<TransactionBank>` — [transaction-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-bank.service.ts#L54) (L54–58)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete<ApiSuccessResponse<TransactionBank>>('${BASE_URL}/${id}/image').pipe`, `this.http.delete`, `map`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}/image'`
- **Consumidores:** [transaction-bank-image-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-image-modal-transaction-bank-image-modal-component-ts)

#### Función `transactionBankImageUrl` (L65–67)

- **Tipo:** función exportada
- **Firma:** `transactionBankImageUrl(bank: Pick<TransactionBank, 'id' \| 'hasImage' \| 'updatedAt'>): string \| null` — [transaction-bank.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-bank.service.ts#L65)
- **Propósito / descripción:** URL pública del logo (un `&lt;img&gt;` no puede mandar el token), o `null` si no tiene. `?v=updatedAt` invalida la caché de 24 h del backend al reemplazarla.
- **Dependencias:** `encodeURIComponent`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [transaction-bank-image-modal.component.ts](dashboard-transaction-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-banks-components-transaction-bank-image-modal-transaction-bank-image-modal-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-transaction-type-service-ts"></a>

### transaction-type.service.ts

- **Ruta:** [transaction-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-type.service.ts) (`comercial-jhoel-app/src/app/core/services/transaction-type.service.ts`, 44 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `TransactionTypeService`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [transaccionar-page.component.ts](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts), [transaction-type-form-modal.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-form-modal-transaction-type-form-modal-component-ts), [transaction-types-page.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts)

#### Clase `TransactionTypeService` (L10–43)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getTransactionTypes` | método public | 15–19 | `includeInactive?` | `Observable<TransactionType[]>` |
| `getTransactionTypeById` | método public | 21–25 | `id: string` | `Observable<TransactionType>` |
| `createTransactionType` | método public | 27–31 | `input: TransactionTypeInput` | `Observable<TransactionType>` |
| `updateTransactionType` | método public | 33–37 | `id: string`, `input: TransactionTypeInput` | `Observable<TransactionType>` |
| `deleteTransactionType` | método public | 40–42 | `id: string` | `Observable<void>` |

##### `TransactionTypeService.getTransactionTypes`

- **Firma:** `getTransactionTypes(includeInactive?): Observable<TransactionType[]>` — [transaction-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-type.service.ts#L15) (L15–19)
- **Propósito / descripción:** Active-only by default — what Transaccionar's dashboard cards should offer.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [transaction-types-page.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts)

##### `TransactionTypeService.getTransactionTypeById`

- **Firma:** `getTransactionTypeById(id: string): Observable<TransactionType>` — [transaction-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-type.service.ts#L21) (L21–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<TransactionType>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TransactionTypeService.createTransactionType`

- **Firma:** `createTransactionType(input: TransactionTypeInput): Observable<TransactionType>` — [transaction-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-type.service.ts#L27) (L27–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<TransactionType>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [transaction-type-form-modal.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-form-modal-transaction-type-form-modal-component-ts)

##### `TransactionTypeService.updateTransactionType`

- **Firma:** `updateTransactionType(id: string, input: TransactionTypeInput): Observable<TransactionType>` — [transaction-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-type.service.ts#L33) (L33–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<TransactionType>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [transaction-type-form-modal.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-components-transaction-type-form-modal-transaction-type-form-modal-component-ts)

##### `TransactionTypeService.deleteTransactionType`

- **Firma:** `deleteTransactionType(id: string): Observable<void>` — [transaction-type.service.ts](../../../../comercial-jhoel-app/src/app/core/services/transaction-type.service.ts#L40) (L40–42)
- **Propósito / descripción:** Soft delete — the backend deactivates the tipo de transacción, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [transaction-types-page.component.ts](dashboard-transaction-types.md#f-comercial-jhoel-app-src-app-features-dashboard-transaction-types-transaction-types-page-component-ts)

<a id="f-comercial-jhoel-app-src-app-core-services-unit-of-measure-service-ts"></a>

### unit-of-measure.service.ts

- **Ruta:** [unit-of-measure.service.ts](../../../../comercial-jhoel-app/src/app/core/services/unit-of-measure.service.ts) (`comercial-jhoel-app/src/app/core/services/unit-of-measure.service.ts`, 67 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `UnitOfMeasureService`, `toParams`, `BASE_URL` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [product-form-modal.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts), [inventory-page.component.ts](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-inventory-page-component-ts), [units-of-measure-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-units-of-measure-tab-units-of-measure-tab-component-ts)

#### Clase `UnitOfMeasureService` (L27–66)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getUnitsOfMeasure` | método public | 31–39 | `filters?: UnitOfMeasureFilters` | `Observable<UnitOfMeasureListItem[]>` |
| `getUnitOfMeasureById` | método public | 41–45 | `id: string` | `Observable<UnitOfMeasure>` |
| `createUnitOfMeasure` | método public | 47–51 | `input: UnitOfMeasureInput` | `Observable<UnitOfMeasure>` |
| `updateUnitOfMeasure` | método public | 53–60 | `id: string`, `input: Partial<UnitOfMeasureInput>` | `Observable<UnitOfMeasure>` |
| `deleteUnitOfMeasure` | método public | 63–65 | `id: string` | `Observable<void>` |

##### `UnitOfMeasureService.getUnitsOfMeasure`

- **Firma:** `getUnitsOfMeasure(filters?: UnitOfMeasureFilters): Observable<UnitOfMeasureListItem[]>` — [unit-of-measure.service.ts](../../../../comercial-jhoel-app/src/app/core/services/unit-of-measure.service.ts#L31) (L31–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `toParams`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [units-of-measure-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-units-of-measure-tab-units-of-measure-tab-component-ts)

##### `UnitOfMeasureService.getUnitOfMeasureById`

- **Firma:** `getUnitOfMeasureById(id: string): Observable<UnitOfMeasure>` — [unit-of-measure.service.ts](../../../../comercial-jhoel-app/src/app/core/services/unit-of-measure.service.ts#L41) (L41–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<UnitOfMeasure>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UnitOfMeasureService.createUnitOfMeasure`

- **Firma:** `createUnitOfMeasure(input: UnitOfMeasureInput): Observable<UnitOfMeasure>` — [unit-of-measure.service.ts](../../../../comercial-jhoel-app/src/app/core/services/unit-of-measure.service.ts#L47) (L47–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<UnitOfMeasure>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [units-of-measure-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-units-of-measure-tab-units-of-measure-tab-component-ts)

##### `UnitOfMeasureService.updateUnitOfMeasure`

- **Firma:** `updateUnitOfMeasure(id: string, input: Partial<UnitOfMeasureInput>): Observable<UnitOfMeasure>` — [unit-of-measure.service.ts](../../../../comercial-jhoel-app/src/app/core/services/unit-of-measure.service.ts#L53) (L53–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<UnitOfMeasure>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [units-of-measure-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-units-of-measure-tab-units-of-measure-tab-component-ts)

##### `UnitOfMeasureService.deleteUnitOfMeasure`

- **Firma:** `deleteUnitOfMeasure(id: string): Observable<void>` — [unit-of-measure.service.ts](../../../../comercial-jhoel-app/src/app/core/services/unit-of-measure.service.ts#L63) (L63–65)
- **Propósito / descripción:** Soft delete — the backend deactivates the row, it never deletes it.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [units-of-measure-tab.component.ts](dashboard-presentation-units.md#f-comercial-jhoel-app-src-app-features-dashboard-presentation-units-components-units-of-measure-tab-units-of-measure-tab-component-ts)

#### Función `toParams` (L16–25)

- **Tipo:** función local del archivo
- **Firma:** `toParams(filters: UnitOfMeasureFilters): HttpParams` — [unit-of-measure.service.ts](../../../../comercial-jhoel-app/src/app/core/services/unit-of-measure.service.ts#L16)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new HttpParams`, `params.set`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-core-services-user-service-ts"></a>

### user.service.ts

- **Ruta:** [user.service.ts](../../../../comercial-jhoel-app/src/app/core/services/user.service.ts) (`comercial-jhoel-app/src/app/core/services/user.service.ts`, 43 líneas)
- **Tipo:** Servicio · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-services`
- **Responsabilidad:** Servicio: declara `UserService`, `BASE_URL`, `LIST_LIMIT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [environment.ts](environments.md#f-comercial-jhoel-app-src-environments-environment-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [bank-deposits-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts), [bank-movements-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts), [bank-transfers-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-transfers-bank-transfers-report-page-component-ts), [ice-cream-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-ice-cream-ice-cream-report-page-component-ts), [purchases-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-purchases-purchases-report-page-component-ts), [sales-report-page.component.ts](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-sales-sales-report-page-component-ts), [user-form-modal.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-form-modal-user-form-modal-component-ts), [users-page.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts)

#### Clase `UserService` (L11–42)

- **Decoradores:** `@Injectable({ providedIn: 'root' })`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `http = inject(HttpClient)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `getUsers` | método public | 16–22 | `includeInactive?` | `Observable<User[]>` |
| `getUserById` | método public | 24–26 | `id: string` | `Observable<User>` |
| `createUser` | método public | 28–30 | `input: CreateUserInput` | `Observable<User>` |
| `updateUser` | método public | 32–36 | `id: string`, `input: UpdateUserInput` | `Observable<User>` |
| `deleteUser` | método public | 39–41 | `id: string` | `Observable<void>` |

##### `UserService.getUsers`

- **Firma:** `getUsers(includeInactive?): Observable<User[]>` — [user.service.ts](../../../../comercial-jhoel-app/src/app/core/services/user.service.ts#L16) (L16–22)
- **Propósito / descripción:** Active-only by default. The admin management screen passes `true` — it needs to show inactive accounts too.
- **Dependencias (llamadas en su cuerpo):** `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `BASE_URL`
- **Consumidores:** [users-page.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts)

##### `UserService.getUserById`

- **Firma:** `getUserById(id: string): Observable<User>` — [user.service.ts](../../../../comercial-jhoel-app/src/app/core/services/user.service.ts#L24) (L24–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.get<ApiSuccessResponse<User>>('${BASE_URL}/${id}').pipe`, `this.http.get`, `map`
- **Efectos secundarios:** HTTP: GET `'${BASE_URL}/${id}'`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `UserService.createUser`

- **Firma:** `createUser(input: CreateUserInput): Observable<User>` — [user.service.ts](../../../../comercial-jhoel-app/src/app/core/services/user.service.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.post<ApiSuccessResponse<User>>(BASE_URL, input).pipe`, `this.http.post`, `map`
- **Efectos secundarios:** HTTP: POST `BASE_URL`
- **Consumidores:** [user-form-modal.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-form-modal-user-form-modal-component-ts)

##### `UserService.updateUser`

- **Firma:** `updateUser(id: string, input: UpdateUserInput): Observable<User>` — [user.service.ts](../../../../comercial-jhoel-app/src/app/core/services/user.service.ts#L32) (L32–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.http.patch<ApiSuccessResponse<User>>('${BASE_URL}/${id}', input).pipe`, `this.http.patch`, `map`
- **Efectos secundarios:** HTTP: PATCH `'${BASE_URL}/${id}'`
- **Consumidores:** [user-form-modal.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-components-user-form-modal-user-form-modal-component-ts)

##### `UserService.deleteUser`

- **Firma:** `deleteUser(id: string): Observable<void>` — [user.service.ts](../../../../comercial-jhoel-app/src/app/core/services/user.service.ts#L39) (L39–41)
- **Propósito / descripción:** Soft delete — the backend deactivates the user, it never deletes the row.
- **Dependencias (llamadas en su cuerpo):** `this.http.delete`
- **Efectos secundarios:** HTTP: DELETE `'${BASE_URL}/${id}'`
- **Consumidores:** [users-page.component.ts](dashboard-users.md#f-comercial-jhoel-app-src-app-features-dashboard-users-users-page-component-ts)

