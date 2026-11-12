# Frontend `shared-ui`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [account-statement-modal.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-account-statement-modal-account-statement-modal-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | The "Estado de Cuenta" / Kardex view — shared verbatim by Cuentas por Cobrar and Activos (see `KardexAccountService`'s own doc comment): same UI, same mechanics, but the two modules never share balances or movements — that separation lives entirely in which concrete `service` the parent page injects, each scoped to its own backend table. | 9 internas; ext.: @angular/common, @angular/core, @angular/forms | 3 | Media (3 consumidores) |
| [badge.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Componente Angular: declara `BadgeComponent`, `BadgeTone` (sin comentario de documentación en el código). | 0 internas; ext.: @angular/core | 55 | Alta (55 consumidores) |
| [bank-balance-amount.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Un saldo bancario tal como lo guarda el backend: con su signo real (`-Q 5,000.00`, nunca convertido a positivo). | 1 internas; ext.: @angular/core | 11 | Alta (11 consumidores) |
| [bank-balance-strip.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Tira de saldos (tipo navbar) — Transaccionar y Resumen. | 7 internas; ext.: @angular/core | 3 | Media (3 consumidores) |
| [barcode-scanner-modal.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Modal de escaneo de código de barras vía cámara — el único lugar de toda la app que toca `getUserMedia`/`MediaStream`. | 2 internas; ext.: @angular/core, @zxing/browser, @zxing/library | 12 | Alta (12 consumidores) |
| [button.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Componente Angular: declara `ButtonComponent`, `ButtonVariant`, `ButtonSize` (sin comentario de documentación en el código). | 0 internas; ext.: @angular/common, @angular/core, @angular/router | 234 | Alta (234 consumidores) |
| [card.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Componente Angular: declara `CardComponent`, `CardTone` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core | 60 | Alta (60 consumidores) |
| [confirm-dialog.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-confirm-dialog-confirm-dialog-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | The single global confirmation dialog — mounted once in `AppComponent`, exactly like `ToastContainerComponent`, and driven by `ConfirmDialogService`. | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [container.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-container-container-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Componente Angular: declara `ContainerComponent` (sin comentario de documentación en el código). | 0 internas; ext.: @angular/core | 6 | Media (6 consumidores) |
| [credit-line-summary.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-credit-line-summary-credit-line-summary-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Resumen de la línea de crédito de BI Club Empresarial: límite, saldo (con su signo real), utilizado y disponible. | 1 internas; ext.: @angular/core | 3 | Media (3 consumidores) |
| [donut-chart.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-donut-chart-donut-chart-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Generic, presentational comparison donut — 2+ segments summing to a center total, same hand-rolled SVG convention `LineChartComponent` established (no charting library anywhere in this codebase). | 3 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [empty-state.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Componente Angular: declara `EmptyStateComponent` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core | 51 | Alta (51 consumidores) |
| [gauge-ring.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-gauge-ring-gauge-ring-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Generic, presentational single-value gauge ring — percentage can exceed 100% (never `Math.min(percentage, 100)`), used for "Saldo Claro"/"Saldo Tigo" (saldo actual vs. | 2 internas; ext.: @angular/core | 3 | Media (3 consumidores) |
| [icon-registry.ts](#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-registry-ts) | .ts | Código TypeScript | Shared (UI reutilizable) | Inline SVG path data keyed by icon name, in a 24x24 viewBox, stroke-based (Feather/Lucide style) so a single `stroke="currentColor"` on the host recolors every icon. | 0 internas | 1 | Baja (1 consumidores) |
| [icon.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Componente Angular: declara `IconComponent` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core, @angular/platform-browser | 305 | Alta (305 consumidores) |
| [image-lightbox.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-image-lightbox-image-lightbox-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Visor de imagen ampliada, reutilizable entre Teléfonos/Librería/Variedades — un solo componente, nunca duplicado por catálogo. | 1 internas; ext.: @angular/core | 5 | Media (5 consumidores) |
| [index.ts](#f-comercial-jhoel-app-src-app-shared-ui-index-ts) | .ts | Barrel (re-exportación) | Shared (UI reutilizable) | Barrel (re-exportación) (sin comentario de documentación en el código). | 28 internas | 347 | Alta (347 consumidores) |
| [landing-background-layer.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-landing-background-layer-landing-background-layer-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | La capa visual de "marca de agua" — usada TANTO por cada sección real de la landing (alimentada por `PublicLandingBackgroundService`) COMO por la vista previa del panel admin (alimentada por el formulario en edición, antes de guardar) — un solo componente, nunca dos implementaciones, así la vista pr | 3 internas; ext.: @angular/common, @angular/core | 3 | Media (3 consumidores) |
| [like-button.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-like-button-like-button-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Botón "me gusta" reutilizable — corazón + conteo, usado por Teléfonos, Librería/Variedades y Noticias en la landing pública. | 1 internas; ext.: @angular/core | 4 | Media (4 consumidores) |
| [line-chart.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Generic, presentational line chart — the exact same hand-rolled SVG visual language `TransactionMonthlyChartComponent` already established (smooth curve, gradient area fill, dashed 3-tick Y axis, sparse X-axis labels, dark-pill hover tooltip, gold "today" marker, skeleton/error/ empty states inside | 3 internas; ext.: @angular/core | 13 | Alta (13 consumidores) |
| [loading-screen.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-loading-screen-loading-screen-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | One-time intro screen shown by `LandingPageComponent` only — see that component's constructor doc comment for why mounting it there (rather than in `AppComponent`) already guarantees it fires once per real entry to `/` and never on an internal anchor/scroll/modal interaction (those never re-run this component's lifecycle). | 0 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [page-header.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Standard dashboard page header — icon badge + title + optional subtitle, with an `&lt;ng-content&gt;` slot for right-side actions (a date picker, a "+ Agregar" button, tab-like controls, etc. | 1 internas; ext.: @angular/core | 68 | Alta (68 consumidores) |
| [pdf-prompt-modal.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-pdf-prompt-modal-pdf-prompt-modal-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | The single global "¿Generar PDF?" prompt — mounted once in `AppComponent`, exactly like `ConfirmDialogComponent`. | 5 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [section-heading.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Componente Angular: declara `SectionHeadingComponent` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core | 10 | Alta (10 consumidores) |
| [section.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Standard section shell: consistent vertical rhythm, background tone and a centered container. | 1 internas; ext.: @angular/core | 14 | Alta (14 consumidores) |
| [stat-card.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-stat-card-stat-card-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Componente Angular: declara `StatCardComponent` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [summary-tile.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Standard KPI tile (icon + title + value + optional description) used inside every `*-summary` component's `&lt;app-card&gt;` grid. | 1 internas; ext.: @angular/core | 22 | Alta (22 consumidores) |
| [toast-container.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-toast-toast-container-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Componente Angular: declara `ToastContainerComponent`, `ICON_BY_TYPE` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [transaction-monthly-chart.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-transaction-monthly-chart-transaction-monthly-chart-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Self-contained, like `TransactionSummaryCardComponent`/`SalesSummaryCardComponent` — fetches `BankDepositService.getDailyStats()` itself. | 5 internas; ext.: @angular/common, @angular/core | 4 | Media (4 consumidores) |
| [update-available-banner.component.ts](#f-comercial-jhoel-app-src-app-shared-ui-update-available-banner-update-available-banner-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Mostrado solo cuando `AppUpdateService` detectó una versión nueva PERO no pudo activarla sola porque hay un borrador con datos sin guardar (Ventas, Compras, Transaccionar, Cuadre de Bancos, Heladería) — en cualquier otro caso (landing pública, dashboard sin operación en curso) la actualización ya ocurrió sin que el usuario tuviera que hacer nada, y este banner nunca llega a aparecer. | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [account-statement-modal.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `account-statement-modal.component.ts`; usa 3 componentes hijos: `app-icon`, `app-badge`, `app-button`. | — | — | Media |
| [account-statement-modal.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [badge.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/badge/badge.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `badge.component.ts`; usa 0 componentes hijos. | — | — | Media |
| [badge.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/badge/badge.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-balance-strip.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/bank-balance-strip/bank-balance-strip.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `bank-balance-strip.component.ts`; usa 2 componentes hijos: `app-icon`, `app-bank-balance-amount`. | — | — | Media |
| [bank-balance-strip.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/bank-balance-strip/bank-balance-strip.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [barcode-scanner-modal.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `barcode-scanner-modal.component.ts`; usa 1 componentes hijos: `app-button`. | — | — | Media |
| [barcode-scanner-modal.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [button.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/button/button.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `button.component.ts`; usa 0 componentes hijos. | — | — | Media |
| [button.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/button/button.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [card.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/card/card.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `card.component.ts`; usa 0 componentes hijos. | — | — | Media |
| [card.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/card/card.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [confirm-dialog.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/confirm-dialog/confirm-dialog.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `confirm-dialog.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [confirm-dialog.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/confirm-dialog/confirm-dialog.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [container.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/container/container.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [donut-chart.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `donut-chart.component.ts`; usa 3 componentes hijos: `app-card`, `app-icon`, `app-empty-state`. | — | — | Media |
| [donut-chart.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [empty-state.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/empty-state/empty-state.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `empty-state.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [empty-state.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/empty-state/empty-state.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [gauge-ring.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/gauge-ring/gauge-ring.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `gauge-ring.component.ts`; usa 2 componentes hijos: `app-card`, `app-icon`. | — | — | Media |
| [gauge-ring.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/gauge-ring/gauge-ring.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [icon.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/icon/icon.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `icon.component.ts`; usa 0 componentes hijos. | — | — | Media |
| [icon.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/icon/icon.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [image-lightbox.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/image-lightbox/image-lightbox.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `image-lightbox.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [image-lightbox.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/image-lightbox/image-lightbox.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [landing-background-layer.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/landing-background-layer/landing-background-layer.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `landing-background-layer.component.ts`; usa 0 componentes hijos. | — | — | Media |
| [landing-background-layer.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/landing-background-layer/landing-background-layer.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [like-button.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/like-button/like-button.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `like-button.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [like-button.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/like-button/like-button.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [line-chart.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `line-chart.component.ts`; usa 3 componentes hijos: `app-card`, `app-icon`, `app-empty-state`. | — | — | Media |
| [line-chart.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [loading-screen.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/loading-screen/loading-screen.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `loading-screen.component.ts`; usa 0 componentes hijos. | — | — | Media |
| [loading-screen.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/loading-screen/loading-screen.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [page-header.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/page-header/page-header.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `page-header.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [page-header.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/page-header/page-header.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [pdf-prompt-modal.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/pdf-prompt-modal/pdf-prompt-modal.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `pdf-prompt-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [pdf-prompt-modal.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/pdf-prompt-modal/pdf-prompt-modal.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [section-heading.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/section-heading/section-heading.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `section-heading.component.ts`; usa 1 componentes hijos: `app-badge`. | — | — | Media |
| [section-heading.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/section-heading/section-heading.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [section.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/section/section.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `section.component.ts`; usa 1 componentes hijos: `app-container`. | — | — | Media |
| [section.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/section/section.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [stat-card.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/stat-card/stat-card.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `stat-card.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [stat-card.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/stat-card/stat-card.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [summary-tile.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/summary-tile/summary-tile.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `summary-tile.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [summary-tile.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/summary-tile/summary-tile.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [toast-container.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/toast/toast-container.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `toast-container.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [toast-container.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/toast/toast-container.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [transaction-monthly-chart.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `transaction-monthly-chart.component.ts`; usa 3 componentes hijos: `app-card`, `app-icon`, `app-empty-state`. | — | — | Media |
| [transaction-monthly-chart.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [update-available-banner.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/update-available-banner/update-available-banner.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `update-available-banner.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [update-available-banner.component.scss](../../../../comercial-jhoel-app/src/app/shared/ui/update-available-banner/update-available-banner.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-shared-ui-account-statement-modal-account-statement-modal-component-ts"></a>

### account-statement-modal.component.ts

- **Ruta:** [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts) (`comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts`, 235 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** The "Estado de Cuenta" / Kardex view — shared verbatim by Cuentas por Cobrar and Activos (see `KardexAccountService`'s own doc comment): same UI, same mechanics, but the two modules never share balances or movements — that separation lives entirely in which concrete `service` the parent page injects, each scoped to its own backend table.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [accounts-receivable-page.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) (plantilla), [assets-page.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts) (plantilla)
- **Plantilla:** [account-statement-modal.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(click)="openMovementForm('CARGO')"`, `(click)="openMovementForm('ABONO')"`, `(ngSubmit)="submitMovement()"`, `(click)="cancelMovementForm()"`, `(change)="onDateFromChange($any($event.target).value)"`, `(change)="onDateToChange($any($event.target).value)"`, `(click)="clearDateFilters()"`

**Interfaces, tipos y enums:**

- `interface KardexStatementClient` (L20): Only `id`/`name` are actually needed here — a full `Client` isn't always at hand from a table row (`AccountReceivable`/`Asset` only carry `clientId`/`clientName`), and fabricating the rest would be pointless. — miembros: `id`, `name`

#### Clase `AccountStatementModalComponent` (L54–234)

- **Decoradores:** `@Component({ selector: 'app-account-statement-modal', standalone: true, imports: [DatePipe, ReactiveFormsModule, ButtonComponent, IconComponent, BadgeComponent, `
- **Herencia / contratos:** implements OnChanges
- **Propósito:** The "Estado de Cuenta" / Kardex view — shared verbatim by Cuentas por Cobrar and Activos (see `KardexAccountService`'s own doc comment): same UI, same mechanics, but the two modules never share balances or movements — that separation lives entirely in which concrete `service` the parent page injects, each scoped to its own backend table. Registering a cargo/abono always shows a live saldo-anterior/monto/ saldo-nuevo preview and requires the global confirmation dialog (`FINANCIAL_OPERATION`) before the real call fires — per the system's "toda operación financiera requiere confirmación" rule. The statement itself (opening balance, movements, totals) is always re-fetched from the backend, never computed by summing the full history client-side.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input client = null`, `@Input service: KardexAccountService`, `@Input title = 'Estado de Cuenta'`, `@Input canManage = false`, `@Output closed = new EventEmitter<void>()`, `@Output changed = new EventEmitter<void>()`, `statement = signal<KardexStatement \| null>(null)`, `loading = signal(false)`, `currentBalance = signal<number \| null>(null)`, `dateFrom = signal('')`, `dateTo = signal('')`, `activeMovementType = signal<KardexMovementType \| null>(null)`, `isSubmittingMovement = signal(false)`, `movementError = signal<string \| null>(null)`, `isSaldado = computed(() => this.statement()?.closingBalance ==`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `previewNewBalance` | método public | 108–116 | — | `number` |
| `ngOnChanges` | método public | 118–127 | `changes: SimpleChanges` | `void` |
| `fetchStatement` | método private | 129–151 | — | `void` |
| `onDateFromChange` | método public | 153–156 | `value: string` | `void` |
| `onDateToChange` | método public | 158–161 | `value: string` | `void` |
| `clearDateFilters` | método public | 163–167 | — | `void` |
| `openMovementForm` | método public | 169–173 | `type: KardexMovementType` | `void` |
| `cancelMovementForm` | método public | 175–178 | — | `void` |
| `submitMovement` | método public async | 180–225 | — | `Promise<void>` |
| `close` | método public | 227–233 | — | `void` |

##### `AccountStatementModalComponent.previewNewBalance`

- **Firma:** `previewNewBalance(): number` — [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts#L108) (L108–116)
- **Propósito / descripción:** A plain method, not a `computed()`, on purpose — `form.controls.amount.value` is a Reactive Forms property, not a signal, so a `computed()` reading it would never invalidate as the user types (Angular's signal graph has no way to know a `FormControl`'s value changed). The template already re-evaluates this on every change-detection cycle, the same way it already does for the adjacent "Monto: {{ ... }}" preview line.
- **Dependencias (llamadas en su cuerpo):** `this.activeMovementType`, `this.statement`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `account-statement-modal.component.html` (plantilla)

##### `AccountStatementModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts#L118) (L118–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dateFrom.set`, `this.dateTo.set`, `this.activeMovementType.set`, `this.movementError.set`, `this.fetchStatement`
- **Efectos secundarios:** Actualiza estado (signals): `this.dateFrom.set`, `this.dateTo.set`, `this.activeMovementType.set`, `this.movementError.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AccountStatementModalComponent.fetchStatement`

- **Firma:** `fetchStatement(): void` — [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts#L129) (L129–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.service.getStatement`, `this.dateFrom`, `this.dateTo`, `this.statement.set`, `this.currentBalance.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.statement.set`, `this.currentBalance.set`
- **Consumidores:** (mismo archivo)

##### `AccountStatementModalComponent.onDateFromChange`

- **Firma:** `onDateFromChange(value: string): void` — [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts#L153) (L153–156)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dateFrom.set`, `this.fetchStatement`
- **Efectos secundarios:** Actualiza estado (signals): `this.dateFrom.set`
- **Consumidores:** `account-statement-modal.component.html` (plantilla)

##### `AccountStatementModalComponent.onDateToChange`

- **Firma:** `onDateToChange(value: string): void` — [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts#L158) (L158–161)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dateTo.set`, `this.fetchStatement`
- **Efectos secundarios:** Actualiza estado (signals): `this.dateTo.set`
- **Consumidores:** `account-statement-modal.component.html` (plantilla)

##### `AccountStatementModalComponent.clearDateFilters`

- **Firma:** `clearDateFilters(): void` — [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts#L163) (L163–167)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dateFrom.set`, `this.dateTo.set`, `this.fetchStatement`
- **Efectos secundarios:** Actualiza estado (signals): `this.dateFrom.set`, `this.dateTo.set`
- **Consumidores:** `account-statement-modal.component.html` (plantilla)

##### `AccountStatementModalComponent.openMovementForm`

- **Firma:** `openMovementForm(type: KardexMovementType): void` — [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts#L169) (L169–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.activeMovementType.set`, `this.movementError.set`, `this.form.reset`, `todayIsoDate`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeMovementType.set`, `this.movementError.set`
- **Consumidores:** `account-statement-modal.component.html` (plantilla)

##### `AccountStatementModalComponent.cancelMovementForm`

- **Firma:** `cancelMovementForm(): void` — [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts#L175) (L175–178)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.activeMovementType.set`, `this.movementError.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeMovementType.set`, `this.movementError.set`
- **Consumidores:** `account-statement-modal.component.html` (plantilla)

##### `AccountStatementModalComponent.submitMovement`

- **Firma:** `submitMovement(): Promise<void>` — [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts#L180) (L180–225)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.activeMovementType`, `this.isSubmittingMovement`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.statement`, `this.confirmDialogService.confirm`, `formatCurrency`, `this.movementError.set`, `this.isSubmittingMovement.set`, `description.trim().replace`, `description.trim`, `this.service.registerCharge`, `this.service.registerPayment`, `request$.subscribe`, `this.activeMovementType.set`, `this.notificationService.success`, `this.fetchStatement`, `this.changed.emit`…
- **Efectos secundarios:** Actualiza estado (signals): `this.movementError.set`, `this.isSubmittingMovement.set`, `this.activeMovementType.set`; Emite eventos: `this.changed.emit`
- **Consumidores:** `account-statement-modal.component.html` (plantilla)

##### `AccountStatementModalComponent.close`

- **Firma:** `close(): void` — [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts#L227) (L227–233)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmittingMovement`, `this.activeMovementType.set`, `this.closed.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.activeMovementType.set`; Emite eventos: `this.closed.emit`
- **Consumidores:** `account-statement-modal.component.html` (plantilla)

#### Función `todayIsoDate` (L33–38)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [account-statement-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/account-statement-modal/account-statement-modal.component.ts#L33)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts"></a>

### badge.component.ts

- **Ruta:** [badge.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/badge/badge.component.ts) (`comercial-jhoel-app/src/app/shared/ui/badge/badge.component.ts`, 15 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Componente Angular: declara `BadgeComponent`, `BadgeTone` (sin comentario de documentación en el código).
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [account-statement-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-account-statement-modal-account-statement-modal-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [section-heading.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts), [catalog-page.component.ts (plantilla)](catalog.md#f-comercial-jhoel-app-src-app-features-catalog-catalog-page-component-ts) (plantilla), [account-type-table.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-table-account-type-table-component-ts) (plantilla), [account-receivable-table.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-table-account-receivable-table-component-ts) (plantilla), [payment-history-modal.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-payment-history-modal-payment-history-modal-component-ts) (plantilla), [asset-table.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-table-asset-table-component-ts) (plantilla), [bank-table.component.ts (plantilla)](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-table-bank-table-component-ts) (plantilla), [business-table.component.ts (plantilla)](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-table-business-table-component-ts) (plantilla), [catalog-bank-table.component.ts (plantilla)](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-catalog-bank-table-catalog-bank-table-component-ts) (plantilla), [catalog-phone-table.component.ts (plantilla)](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-table-catalog-phone-table-component-ts) (plantilla), [catalog-product-request-table.component.ts (plantilla)](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-table-catalog-product-request-table-component-ts) (plantilla), [catalog-product-table.component.ts (plantilla)](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-table-catalog-product-table-component-ts) (plantilla), [catalog-request-table.component.ts (plantilla)](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-table-catalog-request-table-component-ts) (plantilla) y 40 más
- **Plantilla:** [badge.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/badge/badge.component.html)

**Interfaces, tipos y enums:**

- `type BadgeTone` (L3) = `'brand' \| 'gold' \| 'success' \| 'danger' \| 'neutral-dark' \| 'neutral-light'`

#### Clase `BadgeComponent` (L5–14)

- **Decoradores:** `@Component({ selector: 'app-badge', standalone: true, templateUrl: './badge.component.html', styleUrl: './badge.component.scss', changeDetection: ChangeDetection`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input tone = 'brand'`
<a id="f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts"></a>

### bank-balance-amount.component.ts

- **Ruta:** [bank-balance-amount.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/bank-balance-amount/bank-balance-amount.component.ts) (`comercial-jhoel-app/src/app/shared/ui/bank-balance-amount/bank-balance-amount.component.ts`, 61 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Un saldo bancario tal como lo guarda el backend: con su signo real (`-Q 5,000.00`, nunca convertido a positivo).
- **Depende de (archivos del proyecto):** [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [bank-balance-strip.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [bank-agents-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts) (plantilla), [adjust-balance-modal.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-adjust-balance-modal-adjust-balance-modal-component-ts) (plantilla), [bank-transfers-page.component.ts (plantilla)](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts) (plantilla), [balance-credit.component.ts (plantilla)](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts) (plantilla), [bank-movements-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-movements-bank-movements-report-page-component-ts) (plantilla), [bank-picker-modal.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-bank-picker-modal-bank-picker-modal-component-ts) (plantilla), [save-confirm-modal.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-components-save-confirm-modal-save-confirm-modal-component-ts) (plantilla), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla), [bank-balance-strip.component.ts (plantilla)](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts) (plantilla)

#### Clase `BankBalanceAmountComponent` (L11–60)

- **Decoradores:** `@Component({ selector: 'app-bank-balance-amount', standalone: true, template: ' <span class="amount" [class.amount--negative]="value < 0" [class.amount--strong]=`
- **Propósito:** Un saldo bancario tal como lo guarda el backend: con su signo real (`-Q 5,000.00`, nunca convertido a positivo). Para la línea de crédito de Fundación Génesis, un negativo además se etiqueta "Saldo a favor" — la etiqueta es solo visual, el número mostrado nunca cambia.
- **Datos / estado que administra:** `@Input value = 0`, `@Input specialAccount = null`, `@Input strong = false`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `formatted` | getter public | 53–55 | — | `string` |
| `favor` | getter public | 57–59 | — | `boolean` |

##### `BankBalanceAmountComponent.formatted`

- **Firma:** `formatted(): string` — [bank-balance-amount.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/bank-balance-amount/bank-balance-amount.component.ts#L53) (L53–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `formatSignedBankBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankBalanceAmountComponent.favor`

- **Firma:** `favor(): boolean` — [bank-balance-amount.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/bank-balance-amount/bank-balance-amount.component.ts#L57) (L57–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `isFavorBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts"></a>

### bank-balance-strip.component.ts

- **Ruta:** [bank-balance-strip.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/bank-balance-strip/bank-balance-strip.component.ts) (`comercial-jhoel-app/src/app/shared/ui/bank-balance-strip/bank-balance-strip.component.ts`, 70 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Tira de saldos (tipo navbar) — Transaccionar y Resumen.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts), [refetch-on-tab-visible.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-refetch-on-tab-visible-ts), [guayacan-cash-sync.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-guayacan-cash-sync-service-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [dashboard-home.component.ts (plantilla)](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts) (plantilla), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [bank-balance-strip.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/bank-balance-strip/bank-balance-strip.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [bank-balance-amount.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-amount-bank-balance-amount-component-ts)

#### Clase `BankBalanceStripComponent` (L19–69)

- **Decoradores:** `@Component({ selector: 'app-bank-balance-strip', standalone: true, imports: [IconComponent, BankBalanceAmountComponent], templateUrl: './bank-balance-strip.compo`
- **Propósito:** Tira de saldos (tipo navbar) — Transaccionar y Resumen. Por cuenta: nombre, saldo actual y número de cuenta, con una flecha según su ÚLTIMA transacción (subió o bajó el saldo). Dirección y color vienen del backend (`GET /banks/balance-strip`): verde = favorable, rojo = desfavorable; para Génesis y BI Club bajar es lo favorable. Se autocarga igual que `TransactionMonthlyChartComponent`, y se vuelve a pedir al regresar a la pestaña.
- **Servicios inyectados con `inject()`:** `bankService = inject(BankService)`
- **Datos / estado que administra:** `items = signal<BankBalanceStripItem[]>([])`, `loading = signal(true)`, `failed = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `trendLabel` | método public | 42–54 | `item: BankBalanceStripItem` | `string` |
| `load` | método public | 56–68 | — | `void` |

##### `BankBalanceStripComponent.trendLabel`

- **Firma:** `trendLabel(item: BankBalanceStripItem): string` — [bank-balance-strip.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/bank-balance-strip/bank-balance-strip.component.ts#L42) (L42–54)
- **Propósito / descripción:** Tooltip: cuánto movió el saldo la última transacción y cuándo.
- **Dependencias (llamadas en su cuerpo):** `new Date(item.lastMovementAt).toLocaleString`, `new Date`, `formatSignedBankBalance`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `bank-balance-strip.component.html` (plantilla)

##### `BankBalanceStripComponent.load`

- **Firma:** `load(): void` — [bank-balance-strip.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/bank-balance-strip/bank-balance-strip.component.ts#L56) (L56–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.bankService.getBalanceStrip().subscribe`, `this.bankService.getBalanceStrip`, `this.items.set`, `this.loading.set`, `this.failed.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.items.set`, `this.loading.set`, `this.failed.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts"></a>

### barcode-scanner-modal.component.ts

- **Ruta:** [barcode-scanner-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.ts) (`comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.ts`, 173 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Modal de escaneo de código de barras vía cámara — el único lugar de toda la app que toca `getUserMedia`/`MediaStream`.
- **Depende de (archivos del proyecto):** [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Paquetes externos:** `@angular/core`, `@zxing/browser`, `@zxing/library`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [ice-cream-product-search.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-purchases-components-ice-cream-product-search-ice-cream-product-search-component-ts) (plantilla), [ice-cream-product-search.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-sales-components-ice-cream-product-search-ice-cream-product-search-component-ts) (plantilla), [inventory-toolbar.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-inventory-toolbar-inventory-toolbar-component-ts) (plantilla), [presentation-form-modal.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-presentation-form-modal-presentation-form-modal-component-ts) (plantilla), [product-form-modal.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-product-form-modal-product-form-modal-component-ts) (plantilla), [quick-transfer-modal.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-quick-transfer-modal-quick-transfer-modal-component-ts) (plantilla), [transfer-inventory-modal.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-transfer-inventory-modal-transfer-inventory-modal-component-ts) (plantilla), [purchase-product-search.component.ts (plantilla)](dashboard-purchases.md#f-comercial-jhoel-app-src-app-features-dashboard-purchases-components-purchase-product-search-purchase-product-search-component-ts) (plantilla), [quotation-product-search.component.ts (plantilla)](dashboard-quotations.md#f-comercial-jhoel-app-src-app-features-dashboard-quotations-components-quotation-product-search-quotation-product-search-component-ts) (plantilla), [product-search.component.ts (plantilla)](dashboard-sales.md#f-comercial-jhoel-app-src-app-features-dashboard-sales-components-product-search-product-search-component-ts) (plantilla), [ticket-product-search.component.ts (plantilla)](dashboard-tickets.md#f-comercial-jhoel-app-src-app-features-dashboard-tickets-components-ticket-product-search-ticket-product-search-component-ts) (plantilla)
- **Plantilla:** [barcode-scanner-modal.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.html) · **Usa componentes:** [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="cancel()"`, `(click)="$event.stopPropagation()"`

**Interfaces, tipos y enums:**

- `interface ScannerControls` (L31): sin documentación — miembros: `stop`

#### Clase `BarcodeScannerModalComponent` (L43–172)

- **Decoradores:** `@Component({ selector: 'app-barcode-scanner-modal', standalone: true, imports: [ButtonComponent], templateUrl: './barcode-scanner-modal.component.html', styleUrl`
- **Herencia / contratos:** implements OnChanges, AfterViewChecked, OnDestroy
- **Propósito:** Modal de escaneo de código de barras vía cámara — el único lugar de toda la app que toca `getUserMedia`/`MediaStream`. No conoce productos, inventario, precios ni ningún concepto de negocio: solo pide la cámara, decodifica un código y lo emite como texto. Cualquier pantalla que hoy acepta un código tecleado puede abrir este modal y tratar el resultado exactamente como si el usuario lo hubiera escrito a mano.
- **Servicios inyectados con `inject()`:** `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input formats = DEFAULT_FORMATS`, `@Output scanned = new EventEmitter<string>()`, `@Output closed = new EventEmitter<void>()`, `@ViewChild videoElementRef: ElementRef<HTMLVideoElement>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnChanges` | método public | 68–73 | `changes: SimpleChanges` | `void` |
| `ngAfterViewChecked` | método public | 79–85 | — | `void` |
| `ngOnDestroy` | método public | 87–89 | — | `void` |
| `cancel` | método public | 91–95 | — | `void` |
| `startScanning` | método private async | 97–131 | — | `Promise<void>` |
| `handleStartError` | método private | 133–148 | `error: unknown` | `void` |
| `failWith` | método private | 150–155 | `message: string` | `void` |
| `stopScanning` | método private | 157–171 | — | `void` |

##### `BarcodeScannerModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [barcode-scanner-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.ts#L68) (L68–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.stopScanning`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BarcodeScannerModalComponent.ngAfterViewChecked`

- **Firma:** `ngAfterViewChecked(): void` — [barcode-scanner-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.ts#L79) (L79–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.startScanning`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BarcodeScannerModalComponent.ngOnDestroy`

- **Firma:** `ngOnDestroy(): void` — [barcode-scanner-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.stopScanning`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BarcodeScannerModalComponent.cancel`

- **Firma:** `cancel(): void` — [barcode-scanner-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.ts#L91) (L91–95)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.stopScanning`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `barcode-scanner-modal.component.html` (plantilla)

##### `BarcodeScannerModalComponent.startScanning`

- **Firma:** `startScanning(): Promise<void>` — [barcode-scanner-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.ts#L97) (L97–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.failWith`, `new Map`, `hints.set`, `new BrowserMultiFormatReader`, `this.reader.decodeFromConstraints`, `result.getText`, `this.stopScanning`, `this.scanned.emit`, `this.handleStartError`
- **Efectos secundarios:** Emite eventos: `this.scanned.emit`
- **Consumidores:** (mismo archivo)

##### `BarcodeScannerModalComponent.handleStartError`

- **Firma:** `handleStartError(error: unknown): void` — [barcode-scanner-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.ts#L133) (L133–148)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.failWith`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `BarcodeScannerModalComponent.failWith`

- **Firma:** `failWith(message: string): void` — [barcode-scanner-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.ts#L150) (L150–155)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.notificationService.error`, `this.stopScanning`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** (mismo archivo)

##### `BarcodeScannerModalComponent.stopScanning`

- **Firma:** `stopScanning(): void` — [barcode-scanner-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/barcode-scanner-modal/barcode-scanner-modal.component.ts#L157) (L157–171)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.controls?.stop`, `this.activeStream.getTracks().forEach`, `this.activeStream.getTracks`, `track.stop`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts"></a>

### button.component.ts

- **Ruta:** [button.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/button/button.component.ts) (`comercial-jhoel-app/src/app/shared/ui/button/button.component.ts`, 31 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Componente Angular: declara `ButtonComponent`, `ButtonVariant`, `ButtonSize` (sin comentario de documentación en el código).
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`
- **Consumidores:** [account-statement-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-account-statement-modal-account-statement-modal-component-ts), [barcode-scanner-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-barcode-scanner-modal-barcode-scanner-modal-component-ts), [confirm-dialog.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-confirm-dialog-confirm-dialog-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [pdf-prompt-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-pdf-prompt-modal-pdf-prompt-modal-component-ts), [update-available-banner.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-update-available-banner-update-available-banner-component-ts), [login-page.component.ts (plantilla)](auth.md#f-comercial-jhoel-app-src-app-features-auth-login-login-page-component-ts) (plantilla), [catalog-page.component.ts (plantilla)](catalog.md#f-comercial-jhoel-app-src-app-features-catalog-catalog-page-component-ts) (plantilla), [account-type-form-modal.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts) (plantilla), [account-type-table.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-table-account-type-table-component-ts) (plantilla), [account-type-toolbar.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-toolbar-account-type-toolbar-component-ts) (plantilla), [delete-confirm-modal.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-delete-confirm-modal-delete-confirm-modal-component-ts) (plantilla), [accounts-receivable-page.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) (plantilla), [account-receivable-form-modal.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts) (plantilla), [account-receivable-table.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-table-account-receivable-table-component-ts) (plantilla) y 219 más
- **Plantilla:** [button.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/button/button.component.html)

**Interfaces, tipos y enums:**

- `type ButtonVariant` (L5) = `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'ghost-danger' \| 'purple'`
- `type ButtonSize` (L6) = `'sm' \| 'md' \| 'lg'`

#### Clase `ButtonComponent` (L8–30)

- **Decoradores:** `@Component({ selector: 'app-button', standalone: true, imports: [RouterLink, NgTemplateOutlet], templateUrl: './button.component.html', styleUrl: './button.compo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input variant = 'primary'`, `@Input size = 'md'`, `@Input fullWidth = false`, `@Input type = 'button'`, `@Input disabled = false`, `@Input routerLink: string \| any[]`, `@Input fragment: string`, `@Input href: string`, `@Input target: '_blank' \| '_self'`
<a id="f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts"></a>

### card.component.ts

- **Ruta:** [card.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/card/card.component.ts) (`comercial-jhoel-app/src/app/shared/ui/card/card.component.ts`, 32 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Componente Angular: declara `CardComponent`, `CardTone` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [tilt-on-mouse.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-tilt-on-mouse-directive-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [donut-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-donut-chart-donut-chart-component-ts), [gauge-ring.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-gauge-ring-gauge-ring-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts), [transaction-monthly-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-transaction-monthly-chart-transaction-monthly-chart-component-ts), [catalog-page.component.ts (plantilla)](catalog.md#f-comercial-jhoel-app-src-app-features-catalog-catalog-page-component-ts) (plantilla), [account-type-summary.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-summary-account-type-summary-component-ts) (plantilla), [accounts-receivable-page.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) (plantilla), [alert-settings-page.component.ts (plantilla)](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts) (plantilla), [assets-page.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts) (plantilla), [cuadre-agentes-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts) (plantilla), [bank-summary.component.ts (plantilla)](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-summary-bank-summary-component-ts) (plantilla), [business-summary.component.ts (plantilla)](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-summary-business-summary-component-ts) (plantilla), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla), [bank-day-card.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-bank-day-card-bank-day-card-component-ts) (plantilla) y 45 más
- **Plantilla:** [card.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/card/card.component.html)

**Interfaces, tipos y enums:**

- `type CardTone` (L5) = `'light' \| 'dark' \| 'glass'`

#### Clase `CardComponent` (L7–31)

- **Decoradores:** `@Component({ selector: 'app-card', standalone: true, imports: [TiltOnMouseDirective], templateUrl: './card.component.html', styleUrl: './card.component.scss', ch`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input tone = 'light'`, `@Input hoverable = true`, `@Input padding = 'md'`, `@Input tilt = false`
<a id="f-comercial-jhoel-app-src-app-shared-ui-confirm-dialog-confirm-dialog-component-ts"></a>

### confirm-dialog.component.ts

- **Ruta:** [confirm-dialog.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/confirm-dialog/confirm-dialog.component.ts) (`comercial-jhoel-app/src/app/shared/ui/confirm-dialog/confirm-dialog.component.ts`, 99 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** The single global confirmation dialog — mounted once in `AppComponent`, exactly like `ToastContainerComponent`, and driven by `ConfirmDialogService`.
- **Depende de (archivos del proyecto):** [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [app.component.ts (plantilla)](root.md#f-comercial-jhoel-app-src-app-app-component-ts) (plantilla)
- **Plantilla:** [confirm-dialog.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/confirm-dialog/confirm-dialog.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(keydown)="onKeydown($event)"`, `(click)="cancel()"`, `(click)="confirm()"`

#### Clase `ConfirmDialogComponent` (L25–98)

- **Decoradores:** `@Component({ selector: 'app-confirm-dialog', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './confirm-dialog.component.html', styleUr`
- **Herencia / contratos:** implements AfterViewChecked
- **Propósito:** The single global confirmation dialog — mounted once in `AppComponent`, exactly like `ToastContainerComponent`, and driven by `ConfirmDialogService`. Reuses the exact `.modal-backdrop`/`.modal`/`.modal__icon`/`.modal__title`/ `.modal__description`/`.modal__actions` visual pattern already proven (byte-identical for the first two, semantically-varied for the rest) across the 28 existing hand-built confirm modals in this app. Backdrop click and Escape are both deliberately inert — this is the flagship instance of the app-wide "no closing on accidental outside interaction" policy. The only ways to resolve this dialog are the Cancelar button and the Confirmar button.
- **Servicios inyectados con `inject()`:** `confirmDialogService = inject(ConfirmDialogService)`, `elementRef = inject(ElementRef)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `iconToneClass` | método public | 41–43 | `variant: ConfirmDialogVariant` | `string` |
| `ngAfterViewChecked` | método public | 58–71 | — | `void` |
| `onKeydown` | método public | 74–89 | `event: KeyboardEvent` | `void` |
| `confirm` | método public | 91–93 | — | `void` |
| `cancel` | método public | 95–97 | — | `void` |

##### `ConfirmDialogComponent.iconToneClass`

- **Firma:** `iconToneClass(variant: ConfirmDialogVariant): string` — [confirm-dialog.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/confirm-dialog/confirm-dialog.component.ts#L41) (L41–43)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `confirm-dialog.component.html` (plantilla)

##### `ConfirmDialogComponent.ngAfterViewChecked`

- **Firma:** `ngAfterViewChecked(): void` — [confirm-dialog.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/confirm-dialog/confirm-dialog.component.ts#L58) (L58–71)
- **Propósito / descripción:** Moves focus to "Cancelar" (the safe default, so a stray Enter never triggers the confirming/destructive action) the moment the dialog actually renders. Queries the DOM directly for the first native `&lt;button&gt;` inside `.modal__actions` rather than a `@ViewChild` on `&lt;app-button&gt;` itself — `app-button` is a custom element wrapping its own native `&lt;button&gt;`/`&lt;a&gt;`, so focusing its host does nothing; the actual focusable element lives one level inside it. `AfterViewChecked` rather than an `effect()` tied to `pending()` because the button only exists in the DOM once `@if (pending())` has rendered it — a plain effect would race the query on the same change detection pass.
- **Dependencias (llamadas en su cuerpo):** `this.pending`, `this.elementRef.nativeElement.querySelector`, `cancelButton.focus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ConfirmDialogComponent.onKeydown`

- **Firma:** `onKeydown(event: KeyboardEvent): void` — [confirm-dialog.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/confirm-dialog/confirm-dialog.component.ts#L74) (L74–89)
- **Propósito / descripción:** Only two focusable elements ever exist here — Tab/Shift+Tab simply toggles between them, keeping focus from ever escaping to whatever is behind the dialog.
- **Dependencias (llamadas en su cuerpo):** `event.preventDefault`, `dialog?.querySelectorAll`, `Array.from(focusable).indexOf`, `Array.from`, `focusable[nextIndex].focus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `confirm-dialog.component.html` (plantilla)

##### `ConfirmDialogComponent.confirm`

- **Firma:** `confirm(): void` — [confirm-dialog.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/confirm-dialog/confirm-dialog.component.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.respond`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `confirm-dialog.component.html` (plantilla)

##### `ConfirmDialogComponent.cancel`

- **Firma:** `cancel(): void` — [confirm-dialog.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/confirm-dialog/confirm-dialog.component.ts#L95) (L95–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.respond`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `confirm-dialog.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-shared-ui-container-container-component-ts"></a>

### container.component.ts

- **Ruta:** [container.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/container/container.component.ts) (`comercial-jhoel-app/src/app/shared/ui/container/container.component.ts`, 20 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Componente Angular: declara `ContainerComponent` (sin comentario de documentación en el código).
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [hero.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts) (plantilla), [footer.component.ts (plantilla)](layout.md#f-comercial-jhoel-app-src-app-layout-footer-footer-component-ts) (plantilla), [navbar.component.ts (plantilla)](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts) (plantilla), [section.component.ts (plantilla)](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts) (plantilla)

#### Clase `ContainerComponent` (L3–19)

- **Decoradores:** `@Component({ selector: 'app-container', standalone: true, template: '<div class="container" [class.container--wide]="wide" [class.container--fluid]="fluid"><ng-c`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input wide = false`, `@Input fluid = false`
<a id="f-comercial-jhoel-app-src-app-shared-ui-credit-line-summary-credit-line-summary-component-ts"></a>

### credit-line-summary.component.ts

- **Ruta:** [credit-line-summary.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/credit-line-summary/credit-line-summary.component.ts) (`comercial-jhoel-app/src/app/shared/ui/credit-line-summary/credit-line-summary.component.ts`, 93 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Resumen de la línea de crédito de BI Club Empresarial: límite, saldo (con su signo real), utilizado y disponible.
- **Depende de (archivos del proyecto):** [bank-balance.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-bank-balance-util-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [bank-agents-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts) (plantilla), [bank-transfers-page.component.ts (plantilla)](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts) (plantilla)

#### Clase `CreditLineSummaryComponent` (L11–92)

- **Decoradores:** `@Component({ selector: 'app-credit-line-summary', standalone: true, template: ' @if (compact) { <small class="compact"> Línea de crédito · Deuda utilizada {{ for`
- **Propósito:** Resumen de la línea de crédito de BI Club Empresarial: límite, saldo (con su signo real), utilizado y disponible. `utilizado` y `disponible` son cifras de lectura derivadas del saldo — el saldo mostrado nunca se convierte a positivo. `compact` = una sola línea para tablas.
- **Datos / estado que administra:** `@Input balance = 0`, `@Input maxBalance = null`, `@Input compact = false`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `status` | getter public | 89–91 | — | `CreditLineStatus` |

##### `CreditLineSummaryComponent.status`

- **Firma:** `status(): CreditLineStatus` — [credit-line-summary.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/credit-line-summary/credit-line-summary.component.ts#L89) (L89–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `creditLineStatus`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-shared-ui-donut-chart-donut-chart-component-ts"></a>

### donut-chart.component.ts

- **Ruta:** [donut-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.ts) (`comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.ts`, 137 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Generic, presentational comparison donut — 2+ segments summing to a center total, same hand-rolled SVG convention `LineChartComponent` established (no charting library anywhere in this codebase).
- **Depende de (archivos del proyecto):** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [recharge-indicators-section.component.ts (plantilla)](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-components-recharge-indicators-section-recharge-indicators-section-component-ts) (plantilla)
- **Plantilla:** [donut-chart.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="onRetry()"`, `(mouseenter)="onSegmentHover(i)"`, `(mouseleave)="onSegmentLeave()"`

**Interfaces, tipos y enums:**

- `interface DonutSegment` (L19): sin documentación — miembros: `label`, `value`, `color`
- `interface RenderedSegment` (L25): sin documentación — miembros: `segment`, `dashArray`, `dashOffset`, `percent`, `anchorX`, `anchorY`

#### Clase `DonutChartComponent` (L44–136)

- **Decoradores:** `@Component({ selector: 'app-donut-chart', standalone: true, imports: [DecimalPipe, CardComponent, IconComponent, EmptyStateComponent], templateUrl: './donut-char`
- **Propósito:** Generic, presentational comparison donut — 2+ segments summing to a center total, same hand-rolled SVG convention `LineChartComponent` established (no charting library anywhere in this codebase). Used for "Ventas de Recargas" and "Compras de Saldo" (Claro vs. Tigo), but the component itself knows nothing about operators — only labels, values, and colors, exactly like `LineChartComponent` knows nothing about transacciones/ventas/compras.
- **Datos / estado que administra:** `@Input segments = []`, `@Input title: string`, `@Input subtitle: string`, `@Input icon = 'bar-chart'`, `@Input centerLabel = 'Total'`, `@Input loading = false`, `@Input loadError = false`, `@Input emptyTitle = 'Sin datos registrados'`, `@Input emptyDescription = 'Aquí verás el comparativo en cuanto haya datos re`, `@Input compact = false`, `@Output retry = new EventEmitter<void>()`, `hoveredIndex = signal<number \| null>(null)`, `total = computed(() => this.segments.reduce((sum, s) => su`, `hasActivity = computed(() => this.total() > 0)`, `renderedSegments = computed<RenderedSegment[]>(() => { const total = `, `hoveredSegment = computed(() => { const index = this.hoveredIndex()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `formatValue` | propiedad-función public | 59–59 | `value` | (inferido) |
| `glowId` | método public | 71–73 | `index: number` | `string` |
| `onSegmentHover` | método public | 117–119 | `index: number` | `void` |
| `onSegmentLeave` | método public | 121–123 | — | `void` |
| `leftPercent` | método public | 125–127 | `x: number` | `number` |
| `topPercent` | método public | 129–131 | `y: number` | `number` |
| `onRetry` | método public | 133–135 | — | `void` |

##### `DonutChartComponent.formatValue`

- **Firma:** `formatValue(value)` — [donut-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.ts#L59) (L59–59)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** How each segment's value is rendered in the legend and tooltip. Defaults to the plain number.
- **Dependencias (llamadas en su cuerpo):** `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `donut-chart.component.html` (plantilla)

##### `DonutChartComponent.glowId`

- **Firma:** `glowId(index: number): string` — [donut-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `donut-chart.component.html` (plantilla)

##### `DonutChartComponent.onSegmentHover`

- **Firma:** `onSegmentHover(index: number): void` — [donut-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.ts#L117) (L117–119)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.hoveredIndex.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.hoveredIndex.set`
- **Consumidores:** `donut-chart.component.html` (plantilla)

##### `DonutChartComponent.onSegmentLeave`

- **Firma:** `onSegmentLeave(): void` — [donut-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.ts#L121) (L121–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.hoveredIndex.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.hoveredIndex.set`
- **Consumidores:** `donut-chart.component.html` (plantilla)

##### `DonutChartComponent.leftPercent`

- **Firma:** `leftPercent(x: number): number` — [donut-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.ts#L125) (L125–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `donut-chart.component.html` (plantilla)

##### `DonutChartComponent.topPercent`

- **Firma:** `topPercent(y: number): number` — [donut-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.ts#L129) (L129–131)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `donut-chart.component.html` (plantilla)

##### `DonutChartComponent.onRetry`

- **Firma:** `onRetry(): void` — [donut-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/donut-chart/donut-chart.component.ts#L133) (L133–135)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.retry.emit`
- **Efectos secundarios:** Emite eventos: `this.retry.emit`
- **Consumidores:** `donut-chart.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts"></a>

### empty-state.component.ts

- **Ruta:** [empty-state.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/empty-state/empty-state.component.ts) (`comercial-jhoel-app/src/app/shared/ui/empty-state/empty-state.component.ts`, 18 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Componente Angular: declara `EmptyStateComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [donut-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-donut-chart-donut-chart-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts), [transaction-monthly-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-transaction-monthly-chart-transaction-monthly-chart-component-ts), [account-type-table.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-table-account-type-table-component-ts) (plantilla), [account-receivable-table.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-table-account-receivable-table-component-ts) (plantilla), [asset-table.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-table-asset-table-component-ts) (plantilla), [bank-table.component.ts (plantilla)](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-table-bank-table-component-ts) (plantilla), [business-table.component.ts (plantilla)](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-table-business-table-component-ts) (plantilla), [catalog-bank-table.component.ts (plantilla)](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-catalog-bank-table-catalog-bank-table-component-ts) (plantilla), [catalog-phone-table.component.ts (plantilla)](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-components-catalog-phone-table-catalog-phone-table-component-ts) (plantilla), [catalog-product-request-table.component.ts (plantilla)](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-components-catalog-product-request-table-catalog-product-request-table-component-ts) (plantilla), [catalog-product-table.component.ts (plantilla)](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-components-catalog-product-table-catalog-product-table-component-ts) (plantilla), [catalog-request-table.component.ts (plantilla)](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-components-catalog-request-table-catalog-request-table-component-ts) (plantilla), [category-table.component.ts (plantilla)](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-table-category-table-component-ts) (plantilla) y 36 más
- **Plantilla:** [empty-state.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/empty-state/empty-state.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)

#### Clase `EmptyStateComponent` (L5–17)

- **Decoradores:** `@Component({ selector: 'app-empty-state', standalone: true, imports: [IconComponent], templateUrl: './empty-state.component.html', styleUrl: './empty-state.compo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input icon: string`, `@Input title: string`, `@Input description: string`
<a id="f-comercial-jhoel-app-src-app-shared-ui-gauge-ring-gauge-ring-component-ts"></a>

### gauge-ring.component.ts

- **Ruta:** [gauge-ring.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/gauge-ring/gauge-ring.component.ts) (`comercial-jhoel-app/src/app/shared/ui/gauge-ring/gauge-ring.component.ts`, 151 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Generic, presentational single-value gauge ring — percentage can exceed 100% (never `Math.min(percentage, 100)`), used for "Saldo Claro"/"Saldo Tigo" (saldo actual vs.
- **Depende de (archivos del proyecto):** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [recharge-indicators-section.component.ts (plantilla)](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-components-recharge-indicators-section-recharge-indicators-section-component-ts) (plantilla), [recharges-page.component.ts (plantilla)](dashboard-recharges.md#f-comercial-jhoel-app-src-app-features-dashboard-recharges-recharges-page-component-ts) (plantilla)
- **Plantilla:** [gauge-ring.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/gauge-ring/gauge-ring.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="onRetry()"`

**Interfaces, tipos y enums:**

- `type Rgb` (L20) = `[number, number, number]`

#### Clase `GaugeRingComponent` (L79–150)

- **Decoradores:** `@Component({ selector: 'app-gauge-ring', standalone: true, imports: [CardComponent, IconComponent], templateUrl: './gauge-ring.component.html', styleUrl: './gaug`
- **Propósito:** Generic, presentational single-value gauge ring — percentage can exceed 100% (never `Math.min(percentage, 100)`), used for "Saldo Claro"/"Saldo Tigo" (saldo actual vs. límite configurado). The ring itself visually caps at 100% (a full lap), with any excess shown as a thin inner "overflow" ring plus a badge — the exact numeric percentage in the center is always the source of truth, the ring is a supporting visual. The arc is filled with a two-stop gradient (a darker and a lighter shade of the same interpolated status color) plus a soft matching glow, for a glossier, more premium read than a single flat stroke color. Same hand-rolled SVG convention as `LineChartComponent`/`DonutChartComponent` — no charting library anywhere in this codebase.
- **Datos / estado que administra:** `@Input percentage: number`, `@Input title: string`, `@Input subtitle: string`, `@Input icon = 'smartphone'`, `@Input currentValue = 0`, `@Input limitValue = 0`, `@Input currentLabel = 'disponible'`, `@Input limitLabel = 'Límite'`, `@Input loading = false`, `@Input loadError = false`, `@Input compact = false`, `@Output retry = new EventEmitter<void>()`, `safePercentage = computed(() => (Number.isFinite(this.percentage) ?`, `clampedFraction = computed(() => Math.max(0, Math.min(1, this.safePe`, `ringRgb = computed(() => interpolateGaugeRgb(this.clampedFra`, `ringColor = computed(() => toRgbString(this.ringRgb()))`, `gradientStart = computed(() => shade(this.ringRgb(), -0.22))`, `gradientEnd = computed(() => shade(this.ringRgb(), 0.28))`, `glowColor = computed(() => toRgbString(this.ringRgb()))`, `ringDashArray = computed(() => { const length = this.clampedFracti`, `isOverLimit = computed(() => this.safePercentage() > 100)`, `overflowFraction = computed(() => Math.max(0, Math.min(1, (this.safeP`, `overflowDashArray = computed(() => { const length = this.overflowFract`, `displayPercentage = computed(() => { const value = this.safePercentage`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `formatValue` | propiedad-función public | 96–96 | `value` | (inferido) |
| `onRetry` | método public | 147–149 | — | `void` |

##### `GaugeRingComponent.formatValue`

- **Firma:** `formatValue(value)` — [gauge-ring.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/gauge-ring/gauge-ring.component.ts#L96) (L96–96)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `gauge-ring.component.html` (plantilla)

##### `GaugeRingComponent.onRetry`

- **Firma:** `onRetry(): void` — [gauge-ring.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/gauge-ring/gauge-ring.component.ts#L147) (L147–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.retry.emit`
- **Efectos secundarios:** Emite eventos: `this.retry.emit`
- **Consumidores:** `gauge-ring.component.html` (plantilla)

#### Función `interpolateGaugeRgb` (L35–50)

- **Tipo:** función local del archivo
- **Firma:** `interpolateGaugeRgb(t: number): Rgb` — [gauge-ring.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/gauge-ring/gauge-ring.component.ts#L35)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.max`, `Math.min`, `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `shade` (L53–60)

- **Tipo:** función local del archivo
- **Firma:** `shade([r, g, b]: Rgb, amount: number): string` — [gauge-ring.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/gauge-ring/gauge-ring.component.ts#L53)
- **Propósito / descripción:** Moves an RGB triple toward black (`amount &lt; 0`) or white (`amount &gt; 0`), `amount` in [-1, 1] — used to derive the gradient's two stops from one interpolated status color, so the ring reads as glossy/lit rather than a single flat fill.
- **Dependencias:** `Math.round`, `Math.abs`, `Math.max`, `Math.min`, `mix`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `toRgbString` (L62–64)

- **Tipo:** función local del archivo
- **Firma:** `toRgbString([r, g, b]: Rgb): string` — [gauge-ring.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/gauge-ring/gauge-ring.component.ts#L62)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-shared-ui-icon-icon-registry-ts"></a>

### icon-registry.ts

- **Ruta:** [icon-registry.ts](../../../../comercial-jhoel-app/src/app/shared/ui/icon/icon-registry.ts) (`comercial-jhoel-app/src/app/shared/ui/icon/icon-registry.ts`, 103 líneas)
- **Tipo:** Código TypeScript · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Inline SVG path data keyed by icon name, in a 24x24 viewBox, stroke-based (Feather/Lucide style) so a single `stroke="currentColor"` on the host recolors every icon.
- **Descripción del autor (comentario del archivo):** Inline SVG path data keyed by icon name, in a 24x24 viewBox, stroke-based (Feather/Lucide style) so a single `stroke="currentColor"` on the host recolors every icon. Add new icons here — nowhere else needs to change.
- **Consumidores:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)

**Constantes exportadas:**

- `ICONS` (L6): Inline SVG path data keyed by icon name, in a 24x24 viewBox, stroke-based (Feather/Lucide style) so a single `stroke="currentColor"` on the host recolors every icon. = `{ heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21`
<a id="f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts"></a>

### icon.component.ts

- **Ruta:** [icon.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/icon/icon.component.ts) (`comercial-jhoel-app/src/app/shared/ui/icon/icon.component.ts`, 28 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Componente Angular: declara `IconComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [icon-registry.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-registry-ts)
- **Paquetes externos:** `@angular/core`, `@angular/platform-browser`
- **Consumidores:** [account-statement-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-account-statement-modal-account-statement-modal-component-ts), [bank-balance-strip.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-bank-balance-strip-bank-balance-strip-component-ts), [confirm-dialog.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-confirm-dialog-confirm-dialog-component-ts), [donut-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-donut-chart-donut-chart-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [gauge-ring.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-gauge-ring-gauge-ring-component-ts), [image-lightbox.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-image-lightbox-image-lightbox-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [like-button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-like-button-like-button-component-ts), [line-chart.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts), [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [pdf-prompt-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-pdf-prompt-modal-pdf-prompt-modal-component-ts), [stat-card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-stat-card-stat-card-component-ts), [summary-tile.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts), [toast-container.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-toast-toast-container-component-ts) y 290 más
- **Plantilla:** [icon.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/icon/icon.component.html)

#### Clase `IconComponent` (L6–27)

- **Decoradores:** `@Component({ selector: 'app-icon', standalone: true, templateUrl: './icon.component.html', styleUrl: './icon.component.scss', changeDetection: ChangeDetectionStr`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `sanitizer: DomSanitizer`
- **Datos / estado que administra:** `@Input name: string`, `@Input size = 24`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `markup` | getter public | 24–26 | — | `SafeHtml` |

##### `IconComponent.markup`

- **Firma:** `markup(): SafeHtml` — [icon.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/icon/icon.component.ts#L24) (L24–26)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.sanitizer.bypassSecurityTrustHtml`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-shared-ui-image-lightbox-image-lightbox-component-ts"></a>

### image-lightbox.component.ts

- **Ruta:** [image-lightbox.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/image-lightbox/image-lightbox.component.ts) (`comercial-jhoel-app/src/app/shared/ui/image-lightbox/image-lightbox.component.ts`, 74 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Visor de imagen ampliada, reutilizable entre Teléfonos/Librería/Variedades — un solo componente, nunca duplicado por catálogo.
- **Depende de (archivos del proyecto):** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [catalog-banks.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts) (plantilla), [library-catalog.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts) (plantilla), [phones.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts) (plantilla), [varieties-catalog.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts) (plantilla)
- **Plantilla:** [image-lightbox.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/image-lightbox/image-lightbox.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`

#### Clase `ImageLightboxComponent` (L23–73)

- **Decoradores:** `@Component({ selector: 'app-image-lightbox', standalone: true, imports: [IconComponent], templateUrl: './image-lightbox.component.html', styleUrl: './image-light`
- **Herencia / contratos:** implements OnDestroy
- **Propósito:** Visor de imagen ampliada, reutilizable entre Teléfonos/Librería/Variedades — un solo componente, nunca duplicado por catálogo. Se monta como HERMANO del carrusel/grid de cards en el componente de sección (mismo patrón ya usado por `PhoneInterestModalComponent`), nunca anidado dentro de `.{x}-card__inner` (que tiene `transform-style: preserve-3d`) — un overlay `position: fixed` anidado dentro de un ancestro con `transform` queda atrapado por ese ancestro en vez de posicionarse contra el viewport, lo que rompería el efecto flip 3D. Montarlo como hermano evita el problema de raíz. Cierre animado: `close()` primero marca `closing` (fade + zoom de salida, más corto que la entrada) y recién después emite `closed` — el padre sigue siendo quien pone `imageUrl` en `null`, igual que antes.
- **Datos / estado que administra:** `@Input imageUrl = null`, `@Input alt = ''`, `@Output closed = new EventEmitter<void>()`, `closing = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 40–42 | — | `boolean` |
| `onEscape` | método public | 44–49 | — | `void` |
| `close` | método public | 51–66 | — | `void` |
| `ngOnDestroy` | método public | 68–72 | — | `void` |

##### `ImageLightboxComponent.open`

- **Firma:** `open(): boolean` — [image-lightbox.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/image-lightbox/image-lightbox.component.ts#L40) (L40–42)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ImageLightboxComponent.onEscape`

- **Firma:** `onEscape(): void` — [image-lightbox.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/image-lightbox/image-lightbox.component.ts#L44) (L44–49)
- **Decoradores:** `@HostListener('document:keydown.escape')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.close`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ImageLightboxComponent.close`

- **Firma:** `close(): void` — [image-lightbox.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/image-lightbox/image-lightbox.component.ts#L51) (L51–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closing`, `window.matchMedia`, `this.closed.emit`, `this.closing.set`, `setTimeout`
- **Efectos secundarios:** Actualiza estado (signals): `this.closing.set`; Emite eventos: `this.closed.emit`
- **Consumidores:** `image-lightbox.component.html` (plantilla), (mismo archivo)

##### `ImageLightboxComponent.ngOnDestroy`

- **Firma:** `ngOnDestroy(): void` — [image-lightbox.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/image-lightbox/image-lightbox.component.ts#L68) (L68–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `clearTimeout`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-shared-ui-index-ts"></a>

### index.ts

- **Ruta:** [index.ts](../../../../comercial-jhoel-app/src/app/shared/ui/index.ts) (`comercial-jhoel-app/src/app/shared/ui/index.ts`, 29 líneas)
- **Tipo:** Barrel (re-exportación) · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Barrel (re-exportación) (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [like-button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-like-button-like-button-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [container.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-container-container-component-ts), [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [section-heading.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts), [stat-card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-stat-card-stat-card-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [toast-container.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-toast-toast-container-component-ts), [confirm-dialog.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-confirm-dialog-confirm-dialog-component-ts), [pdf-prompt-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-pdf-prompt-modal-pdf-prompt-modal-component-ts), [account-statement-modal.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-account-statement-modal-account-statement-modal-component-ts), [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts) y 13 más
- **Consumidores:** [app.component.ts](root.md#f-comercial-jhoel-app-src-app-app-component-ts), [login-page.component.ts](auth.md#f-comercial-jhoel-app-src-app-features-auth-login-login-page-component-ts), [catalog-page.component.ts](catalog.md#f-comercial-jhoel-app-src-app-features-catalog-catalog-page-component-ts), [account-types-page.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts), [account-type-form-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-form-modal-account-type-form-modal-component-ts), [account-type-summary.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-summary-account-type-summary-component-ts), [account-type-table.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-table-account-type-table-component-ts), [account-type-toolbar.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-toolbar-account-type-toolbar-component-ts), [delete-confirm-modal.component.ts](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-delete-confirm-modal-delete-confirm-modal-component-ts), [accounts-receivable-page.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts), [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts), [account-receivable-table.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-table-account-receivable-table-component-ts), [account-receivable-toolbar.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-toolbar-account-receivable-toolbar-component-ts), [client-search-select.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-client-search-select-client-search-select-component-ts), [delete-confirm-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-delete-confirm-modal-delete-confirm-modal-component-ts) y 332 más
<a id="f-comercial-jhoel-app-src-app-shared-ui-landing-background-layer-landing-background-layer-component-ts"></a>

### landing-background-layer.component.ts

- **Ruta:** [landing-background-layer.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/landing-background-layer/landing-background-layer.component.ts) (`comercial-jhoel-app/src/app/shared/ui/landing-background-layer/landing-background-layer.component.ts`, 124 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** La capa visual de "marca de agua" — usada TANTO por cada sección real de la landing (alimentada por `PublicLandingBackgroundService`) COMO por la vista previa del panel admin (alimentada por el formulario en edición, antes de guardar) — un solo componente, nunca dos implementaciones, así la vista pr
- **Depende de (archivos del proyecto):** [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts), [mouse-shift.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-mouse-shift-directive-ts), [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [background-form-modal.component.ts (plantilla)](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-form-modal-background-form-modal-component-ts) (plantilla), [background-preview-modal.component.ts (plantilla)](dashboard-landing-backgrounds.md#f-comercial-jhoel-app-src-app-features-dashboard-landing-backgrounds-components-background-preview-modal-background-preview-modal-component-ts) (plantilla)
- **Plantilla:** [landing-background-layer.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/landing-background-layer/landing-background-layer.component.html)

#### Clase `LandingBackgroundLayerComponent` (L78–123)

- **Decoradores:** `@Component({ selector: 'app-landing-background-layer', standalone: true, imports: [NgStyle, ParallaxLayerDirective, MouseShiftDirective], templateUrl: './landing`
- **Propósito:** La capa visual de "marca de agua" — usada TANTO por cada sección real de la landing (alimentada por `PublicLandingBackgroundService`) COMO por la vista previa del panel admin (alimentada por el formulario en edición, antes de guardar) — un solo componente, nunca dos implementaciones, así la vista previa jamás se desincroniza de cómo se ve en producción (mismo criterio ya usado por `BankPreviewModalComponent` reutilizando `BankCardComponent`). Se integra con el sistema 3D ya existente en vez de crear uno nuevo: `ParallaxLayerDirective` (el mismo que ya usan los `__glow` decorativos de cada sección) para el desplazamiento por scroll, y `MouseShiftDirective` (nuevo, ver ese archivo) para el desplazamiento sutil por mouse — deliberadamente NO reutiliza `TiltOnMouseDirective`: ese directive rota (`rotateX`/`rotateY`), pensado para una card; una imagen de fondo tipo "profundidad" debe simpleme
- **Datos / estado que administra:** `imageUrl = input<string \| null>(null)`, `opacity = input(25)`, `overlay = input<OverlayLevel>('medium')`, `position = input<BackgroundPosition>('center')`, `size = input<BackgroundSize>('large')`, `depthEffect = input<DepthEffect>('subtle')`, `parallax = input<ParallaxIntensity>('subtle')`, `movement = input<MovementMode>('scroll_mouse')`, `hasParallax = computed(() => this.movement() === 'scroll' \|\| thi`, `hasMouseShift = computed(() => this.movement() === 'mouse' \|\| this`, `isFloating = computed(() => this.movement() === 'floating')`, `parallaxSpeed = computed(() => PARALLAX_SPEED[this.parallax()])`, `imageStyle = computed(() => { const depth = DEPTH_CSS[this.dept`, `overlayStyle = computed(() => ({ opacity: OVERLAY_OPACITY[this.ov`
<a id="f-comercial-jhoel-app-src-app-shared-ui-like-button-like-button-component-ts"></a>

### like-button.component.ts

- **Ruta:** [like-button.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/like-button/like-button.component.ts) (`comercial-jhoel-app/src/app/shared/ui/like-button/like-button.component.ts`, 38 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Botón "me gusta" reutilizable — corazón + conteo, usado por Teléfonos, Librería/Variedades y Noticias en la landing pública.
- **Depende de (archivos del proyecto):** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [news-card.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-card-news-card-component-ts) (plantilla), [phone-card.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-card-phone-card-component-ts) (plantilla), [catalog-product-card.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-card-catalog-product-card-component-ts) (plantilla)
- **Plantilla:** [like-button.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/like-button/like-button.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="onClick($event)"`

#### Clase `LikeButtonComponent` (L13–37)

- **Decoradores:** `@Component({ selector: 'app-like-button', standalone: true, imports: [IconComponent], templateUrl: './like-button.component.html', styleUrl: './like-button.compo`
- **Propósito:** Botón "me gusta" reutilizable — corazón + conteo, usado por Teléfonos, Librería/Variedades y Noticias en la landing pública. Puramente presentacional: no sabe nada de URLs/endpoints (esos difieren por sección) ni de `localStorage` — el padre decide qué endpoint llamar y si recordar el estado "ya di like" de este visitante, este componente solo emite `toggled` y refleja `liked`/`count`.
- **Datos / estado que administra:** `@Input liked = false`, `@Input count = 0`, `@Input disabled = false`, `@Input label = 'este elemento'`, `@Output toggled = new EventEmitter<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onClick` | método public | 30–36 | `event: Event` | `void` |

##### `LikeButtonComponent.onClick`

- **Firma:** `onClick(event: Event): void` — [like-button.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/like-button/like-button.component.ts#L30) (L30–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `event.stopPropagation`, `this.toggled.emit`
- **Efectos secundarios:** Emite eventos: `this.toggled.emit`
- **Consumidores:** `like-button.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-shared-ui-line-chart-line-chart-component-ts"></a>

### line-chart.component.ts

- **Ruta:** [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts) (`comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts`, 232 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Generic, presentational line chart — the exact same hand-rolled SVG visual language `TransactionMonthlyChartComponent` already established (smooth curve, gradient area fill, dashed 3-tick Y axis, sparse X-axis labels, dark-pill hover tooltip, gold "today" marker, skeleton/error/ empty states inside
- **Depende de (archivos del proyecto):** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [daily-transactions-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-daily-transactions-chart-daily-transactions-chart-component-ts) (plantilla), [purchases-daily-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-daily-chart-purchases-daily-chart-component-ts) (plantilla), [purchases-weekly-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-weekly-chart-purchases-weekly-chart-component-ts) (plantilla), [purchases-yearly-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-purchases-yearly-chart-purchases-yearly-chart-component-ts) (plantilla), [recharges-daily-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-daily-chart-recharges-daily-chart-component-ts) (plantilla), [recharges-weekly-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-weekly-chart-recharges-weekly-chart-component-ts) (plantilla), [recharges-yearly-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-recharges-yearly-chart-recharges-yearly-chart-component-ts) (plantilla), [sales-daily-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-daily-chart-sales-daily-chart-component-ts) (plantilla), [sales-weekly-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-weekly-chart-sales-weekly-chart-component-ts) (plantilla), [sales-yearly-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-sales-yearly-chart-sales-yearly-chart-component-ts) (plantilla), [weekly-transactions-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-weekly-transactions-chart-weekly-transactions-chart-component-ts) (plantilla), [yearly-transactions-chart.component.ts (plantilla)](dashboard-graphs.md#f-comercial-jhoel-app-src-app-features-dashboard-graphs-components-yearly-transactions-chart-yearly-transactions-chart-component-ts) (plantilla)
- **Plantilla:** [line-chart.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="onRetry()"`, `(mouseenter)="onPointHover(i)"`, `(mouseleave)="onPointLeave()"`

**Interfaces, tipos y enums:**

- `interface LineChartPoint` (L17): sin documentación — miembros: `label`, `tooltipLabel`, `value`, `isToday`
- `interface RenderedPoint` (L27): sin documentación — miembros: `x`, `y`, `point`, `isMax`, `isMin`

#### Clase `LineChartComponent` (L91–231)

- **Decoradores:** `@Component({ selector: 'app-line-chart', standalone: true, imports: [CardComponent, IconComponent, EmptyStateComponent], templateUrl: './line-chart.component.htm`
- **Propósito:** Generic, presentational line chart — the exact same hand-rolled SVG visual language `TransactionMonthlyChartComponent` already established (smooth curve, gradient area fill, dashed 3-tick Y axis, sparse X-axis labels, dark-pill hover tooltip, gold "today" marker, skeleton/error/ empty states inside an `app-card`), extracted into a reusable, `@Input()`-driven component so a new chart never has to re-implement any of it. `TransactionMonthlyChartComponent` itself is intentionally left untouched — it stays self-contained (fetches its own data) and keeps working byte-for-byte the same on Resumen/Transaccionar/Reporte de Transacciones; this component is for every *other* chart that needs the same look with its own data source. The caller owns fetching and mapping its data into `LineChartPoint[]` — this component never knows about products/ventas/transacciones/etc., only labels and numbers, exa
- **Datos / estado que administra:** `@Input points = []`, `@Input title: string`, `@Input subtitle: string`, `@Input icon = 'trending-up'`, `@Input valueLabel = 'transacciones'`, `@Input loading = false`, `@Input loadError = false`, `@Input emptyTitle = 'Sin datos registrados'`, `@Input emptyDescription = 'Aquí verás el comportamiento en cuanto haya datos`, `@Output retry = new EventEmitter<void>()`, `hoveredIndex = signal<number \| null>(null)`, `hasActivity = computed(() => this.points.some((p) => p.value > 0`, `maxValue = computed(() => this.points.reduce((max, p) => Math`, `maxIndex = computed(() => { const points = this.points; if (p`, `minIndex = computed(() => { const points = this.points; if (p`, `maxPoint = computed(() => (this.maxIndex() >= 0 ? this.points`, `minPoint = computed(() => (this.minIndex() >= 0 ? this.points`, `axisMax = computed(() => computeYAxisMax(this.maxValue()))`, `yAxisTicks = computed(() => buildYAxisTicks(this.axisMax()))`, `chartPoints = computed<RenderedPoint[]>(() => { const points = t`, `linePath = computed(() => buildSmoothPath(this.chartPoints())`, `areaPath = computed(() => { const points = this.chartPoints()`, `labelPoints = computed(() => { const points = this.chartPoints()`, `hoveredPoint = computed(() => { const index = this.hoveredIndex()`, `todayMarker = computed(() => this.chartPoints().find((p) => p.po`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `formatValue` | propiedad-función public | 107–107 | `value` | (inferido) |
| `tickY` | método public | 199–203 | `tick: number` | `number` |
| `onPointHover` | método public | 205–207 | `index: number` | `void` |
| `onPointLeave` | método public | 209–211 | — | `void` |
| `todayMarkerPoints` | método public | 214–218 | `x: number`, `y: number` | `string` |
| `leftPercent` | método public | 220–222 | `x: number` | `number` |
| `topPercent` | método public | 224–226 | `y: number` | `number` |
| `onRetry` | método public | 228–230 | — | `void` |

##### `LineChartComponent.formatValue`

- **Firma:** `formatValue(value)` — [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts#L107) (L107–107)
- **Decoradores:** `@Input()`
- **Propósito / descripción:** How `LineChartPoint.value` is rendered in the tooltip and the Pico/Mínimo pills — defaults to the plain number (counts). Pass `formatCurrency` for a money series.
- **Dependencias (llamadas en su cuerpo):** `String`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `line-chart.component.html` (plantilla)

##### `LineChartComponent.tickY`

- **Firma:** `tickY(tick: number): number` — [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts#L199) (L199–203)
- **Propósito / descripción:** SVG y-coordinate for a given Y-axis tick value — the last (top) tick always equals `axisMax` by construction of `buildYAxisTicks`.
- **Dependencias (llamadas en su cuerpo):** `this.yAxisTicks`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `line-chart.component.html` (plantilla)

##### `LineChartComponent.onPointHover`

- **Firma:** `onPointHover(index: number): void` — [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts#L205) (L205–207)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.hoveredIndex.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.hoveredIndex.set`
- **Consumidores:** `line-chart.component.html` (plantilla)

##### `LineChartComponent.onPointLeave`

- **Firma:** `onPointLeave(): void` — [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts#L209) (L209–211)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.hoveredIndex.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.hoveredIndex.set`
- **Consumidores:** `line-chart.component.html` (plantilla)

##### `LineChartComponent.todayMarkerPoints`

- **Firma:** `todayMarkerPoints(x: number, y: number): string` — [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts#L214) (L214–218)
- **Propósito / descripción:** Small downward-pointing triangle hovering just above the trend line at (x, y) — rides the curve's own height at that column.
- **Dependencias (llamadas en su cuerpo):** `(x - 4).toFixed`, `(x + 4).toFixed`, `x.toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `line-chart.component.html` (plantilla)

##### `LineChartComponent.leftPercent`

- **Firma:** `leftPercent(x: number): number` — [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts#L220) (L220–222)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `line-chart.component.html` (plantilla)

##### `LineChartComponent.topPercent`

- **Firma:** `topPercent(y: number): number` — [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts#L224) (L224–226)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `line-chart.component.html` (plantilla)

##### `LineChartComponent.onRetry`

- **Firma:** `onRetry(): void` — [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts#L228) (L228–230)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.retry.emit`
- **Efectos secundarios:** Emite eventos: `this.retry.emit`
- **Consumidores:** `line-chart.component.html` (plantilla)

#### Función `computeYAxisMax` (L36–44)

- **Tipo:** función local del archivo
- **Firma:** `computeYAxisMax(rawMax: number): number` — [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts#L36)
- **Propósito / descripción:** "Nice" round ticks (1/2/5 × 10^n) for the Y axis — never a fixed scale, always derived from the real max. Identical to `TransactionMonthlyChartComponent`'s own helper.
- **Dependencias:** `Math.pow`, `Math.floor`, `Math.log10`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildYAxisTicks` (L47–49)

- **Tipo:** función local del archivo
- **Firma:** `buildYAxisTicks(axisMax: number): number[]` — [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts#L47)
- **Propósito / descripción:** Just 0 / half / max — a compact chart reads better with fewer gridlines.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildSmoothPath` (L52–71)

- **Tipo:** función local del archivo
- **Firma:** `buildSmoothPath(points: { x: number; y: number }[]): string` — [line-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/line-chart/line-chart.component.ts#L52)
- **Propósito / descripción:** Catmull-Rom → cubic Bezier, uniform tension — passes exactly through every point, only the connecting segments are curved instead of straight. Standard 1/6 control-point scaling. Identical to `TransactionMonthlyChartComponent`'s own helper.
- **Dependencias:** `points[0].x.toFixed`, `points[0].y.toFixed`, `cp1x.toFixed`, `cp1y.toFixed`, `cp2x.toFixed`, `cp2y.toFixed`, `p2.x.toFixed`, `p2.y.toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-shared-ui-loading-screen-loading-screen-component-ts"></a>

### loading-screen.component.ts

- **Ruta:** [loading-screen.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/loading-screen/loading-screen.component.ts) (`comercial-jhoel-app/src/app/shared/ui/loading-screen/loading-screen.component.ts`, 98 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** One-time intro screen shown by `LandingPageComponent` only — see that component's constructor doc comment for why mounting it there (rather than in `AppComponent`) already guarantees it fires once per real entry to `/` and never on an internal anchor/scroll/modal interaction (those never re-run this component's lifecycle).
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [loading-screen.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/loading-screen/loading-screen.component.html)

#### Clase `LoadingScreenComponent` (L29–97)

- **Decoradores:** `@Component({ selector: 'app-loading-screen', standalone: true, templateUrl: './loading-screen.component.html', styleUrl: './loading-screen.component.scss', chang`
- **Propósito:** One-time intro screen shown by `LandingPageComponent` only — see that component's constructor doc comment for why mounting it there (rather than in `AppComponent`) already guarantees it fires once per real entry to `/` and never on an internal anchor/scroll/modal interaction (those never re-run this component's lifecycle). Pure Angular + CSS: no new dependency, no interference with the Service Worker/Web Push (this component never touches either). Progress is a `requestAnimationFrame` loop (never `setInterval`), eased near the end so it doesn't feel like it's linearly crawling to 100.
- **Servicios inyectados con `inject()`:** `destroyRef = inject(DestroyRef)`
- **Datos / estado que administra:** `progress = signal(0)`, `exiting = signal(false)`, `finished = output<void>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `runProgress` | método private | 65–91 | — | `void` |
| `beginExit` | método private | 93–96 | — | `void` |

##### `LoadingScreenComponent.runProgress`

- **Firma:** `runProgress(): void` — [loading-screen.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/loading-screen/loading-screen.component.ts#L65) (L65–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `performance.now`, `Math.max`, `Math.min`, `this.progress.set`, `Math.round`, `requestAnimationFrame`, `this.beginExit`
- **Efectos secundarios:** Actualiza estado (signals): `this.progress.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LoadingScreenComponent.beginExit`

- **Firma:** `beginExit(): void` — [loading-screen.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/loading-screen/loading-screen.component.ts#L93) (L93–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.exiting.set`, `setTimeout`, `this.finished.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.exiting.set`; Emite eventos: `this.finished.emit`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts"></a>

### page-header.component.ts

- **Ruta:** [page-header.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/page-header/page-header.component.ts) (`comercial-jhoel-app/src/app/shared/ui/page-header/page-header.component.ts`, 30 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Standard dashboard page header — icon badge + title + optional subtitle, with an `&lt;ng-content&gt;` slot for right-side actions (a date picker, a "+ Agregar" button, tab-like controls, etc.
- **Depende de (archivos del proyecto):** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [account-types-page.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-account-types-page-component-ts) (plantilla), [accounts-receivable-page.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) (plantilla), [alert-settings-page.component.ts (plantilla)](dashboard-alert-settings.md#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts) (plantilla), [assets-page.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts) (plantilla), [bank-agents-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts) (plantilla), [cuadre-agentes-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts) (plantilla), [bank-transfers-page.component.ts (plantilla)](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts) (plantilla), [banks-page.component.ts (plantilla)](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-banks-page-component-ts) (plantilla), [businesses-page.component.ts (plantilla)](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-businesses-page-component-ts) (plantilla), [cash-control-page.component.ts (plantilla)](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-cash-control-page-component-ts) (plantilla), [catalog-banks-page.component.ts (plantilla)](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-catalog-banks-page-component-ts) (plantilla), [catalog-phones-page.component.ts (plantilla)](dashboard-catalog-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-phones-catalog-phones-page-component-ts) (plantilla), [catalog-product-requests-page.component.ts (plantilla)](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-catalog-product-requests-page-component-ts) (plantilla), [catalog-products-page.component.ts (plantilla)](dashboard-catalog-products.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-products-catalog-products-page-component-ts) (plantilla) y 53 más
- **Plantilla:** [page-header.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/page-header/page-header.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)

#### Clase `PageHeaderComponent` (L17–29)

- **Decoradores:** `@Component({ selector: 'app-page-header', standalone: true, imports: [IconComponent], templateUrl: './page-header.component.html', styleUrl: './page-header.compo`
- **Propósito:** Standard dashboard page header — icon badge + title + optional subtitle, with an `&lt;ng-content&gt;` slot for right-side actions (a date picker, a "+ Agregar" button, tab-like controls, etc. — whatever the page's own `&lt;header&gt;` used to hold there). Replaces the near-identical `&lt;header class="x__header"&gt;&lt;h1&gt;…&lt;/h1&gt;&lt;p&gt;…&lt;/p&gt;&lt;/header&gt;` markup every dashboard page used to hand-roll on its own, each with its own duplicated `__title`/`__subtitle` CSS. `icon` is meant to be the same icon already assigned to that page's entry in `dashboard-nav.data.ts` — reusing the identity the user already recognizes from the Sidebar, never a new one invented per page.
- **Datos / estado que administra:** `@Input icon: string`, `@Input title: string`, `@Input subtitle: string`
<a id="f-comercial-jhoel-app-src-app-shared-ui-pdf-prompt-modal-pdf-prompt-modal-component-ts"></a>

### pdf-prompt-modal.component.ts

- **Ruta:** [pdf-prompt-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/pdf-prompt-modal/pdf-prompt-modal.component.ts) (`comercial-jhoel-app/src/app/shared/ui/pdf-prompt-modal/pdf-prompt-modal.component.ts`, 64 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** The single global "¿Generar PDF?" prompt — mounted once in `AppComponent`, exactly like `ConfirmDialogComponent`.
- **Depende de (archivos del proyecto):** [pdf-prompt-modal.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-pdf-prompt-modal-service-ts), [download-blob.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-download-blob-ts), [extract-blob-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-blob-error-message-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [app.component.ts (plantilla)](root.md#f-comercial-jhoel-app-src-app-app-component-ts) (plantilla)
- **Plantilla:** [pdf-prompt-modal.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/pdf-prompt-modal/pdf-prompt-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="dismiss()"`, `(click)="generate()"`

#### Clase `PdfPromptModalComponent` (L20–63)

- **Decoradores:** `@Component({ selector: 'app-pdf-prompt-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './pdf-prompt-modal.component.html', sty`
- **Propósito:** The single global "¿Generar PDF?" prompt — mounted once in `AppComponent`, exactly like `ConfirmDialogComponent`. X, "No", and "Cancelar" are three visually distinct controls that all resolve to the same outcome (dismiss, no PDF); "Sí, generar PDF" is the only action that fetches anything. Backdrop click is inert (no click handler on `.modal-backdrop` itself, same mechanism `ConfirmDialogComponent` uses) — the only ways to close this dialog are X/No/Cancelar or a successful download.
- **Servicios inyectados con `inject()`:** `pdfPromptModalService = inject(PdfPromptModalService)`
- **Datos / estado que administra:** `isGenerating = signal(false)`, `errorMessage = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `dismiss` | método public | 35–41 | — | `void` |
| `generate` | método public | 43–62 | — | `void` |

##### `PdfPromptModalComponent.dismiss`

- **Firma:** `dismiss(): void` — [pdf-prompt-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/pdf-prompt-modal/pdf-prompt-modal.component.ts#L35) (L35–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isGenerating`, `this.errorMessage.set`, `this.pdfPromptModalService.dismiss`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`
- **Consumidores:** `pdf-prompt-modal.component.html` (plantilla)

##### `PdfPromptModalComponent.generate`

- **Firma:** `generate(): void` — [pdf-prompt-modal.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/pdf-prompt-modal/pdf-prompt-modal.component.ts#L43) (L43–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.pending`, `this.isGenerating`, `this.errorMessage.set`, `this.isGenerating.set`, `options.generate().subscribe`, `options.generate`, `downloadBlob`, `this.pdfPromptModalService.dismiss`, `extractBlobErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isGenerating.set`
- **Consumidores:** `pdf-prompt-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts"></a>

### section-heading.component.ts

- **Ruta:** [section-heading.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/section-heading/section-heading.component.ts) (`comercial-jhoel-app/src/app/shared/ui/section-heading/section-heading.component.ts`, 20 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Componente Angular: declara `SectionHeadingComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [bank-agents.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts) (plantilla), [catalog-banks.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts) (plantilla), [catalog-preview.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-preview-catalog-preview-component-ts) (plantilla), [contact.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-contact-contact-component-ts) (plantilla), [library-catalog.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts) (plantilla), [news.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts) (plantilla), [phones.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts) (plantilla), [services.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-services-services-component-ts) (plantilla), [varieties-catalog.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts) (plantilla)
- **Plantilla:** [section-heading.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/section-heading/section-heading.component.html) · **Usa componentes:** [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)

#### Clase `SectionHeadingComponent` (L5–19)

- **Decoradores:** `@Component({ selector: 'app-section-heading', standalone: true, imports: [BadgeComponent], templateUrl: './section-heading.component.html', styleUrl: './section-`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input eyebrow: string`, `@Input eyebrowTone = 'brand'`, `@Input title: string`, `@Input subtitle: string`, `@Input align = 'center'`
<a id="f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts"></a>

### section.component.ts

- **Ruta:** [section.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/section/section.component.ts) (`comercial-jhoel-app/src/app/shared/ui/section/section.component.ts`, 41 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Standard section shell: consistent vertical rhythm, background tone and a centered container.
- **Depende de (archivos del proyecto):** [container.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-container-container-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [catalog-page.component.ts (plantilla)](catalog.md#f-comercial-jhoel-app-src-app-features-catalog-catalog-page-component-ts) (plantilla), [about.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-about-about-component-ts) (plantilla), [bank-agents.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts) (plantilla), [catalog-preview.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-preview-catalog-preview-component-ts) (plantilla), [contact.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-contact-contact-component-ts) (plantilla), [credibility.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-credibility-credibility-component-ts) (plantilla), [library-catalog.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts) (plantilla), [news.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts) (plantilla), [phones.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts) (plantilla), [services.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-services-services-component-ts) (plantilla), [varieties-catalog.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts) (plantilla), [news-detail-page.component.ts (plantilla)](news-detail.md#f-comercial-jhoel-app-src-app-features-news-detail-news-detail-page-component-ts) (plantilla), [news-preferences-page.component.ts (plantilla)](news-preferences.md#f-comercial-jhoel-app-src-app-features-news-preferences-news-preferences-page-component-ts) (plantilla)
- **Plantilla:** [section.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/section/section.component.html) · **Usa componentes:** [container.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-container-container-component-ts)

**Interfaces, tipos y enums:**

- `type SectionTone` (L16) = `'light' \| 'muted' \| 'dark' \| 'navy' \| 'slate'` — `navy`/`slate` son variantes oscuras adicionales — no un segundo sistema de temas — pensadas para dar jerarquía visual a la landing pública sin volverla un bloque plano de un solo negro (`dark`).
- `type SectionSpacing` (L17) = `'sm' \| 'md' \| 'lg'`

#### Clase `SectionComponent` (L24–40)

- **Decoradores:** `@Component({ selector: 'app-section', standalone: true, imports: [ContainerComponent], templateUrl: './section.component.html', styleUrl: './section.component.sc`
- **Propósito:** Standard section shell: consistent vertical rhythm, background tone and a centered container. Every landing block should be wrapped in this so spacing stays uniform and easy to retune from one place.
- **Datos / estado que administra:** `@Input sectionId: string`, `@Input tone = 'light'`, `@Input spacing = 'md'`, `@Input wideContainer = false`, `@Input fluidContainer = false`
<a id="f-comercial-jhoel-app-src-app-shared-ui-stat-card-stat-card-component-ts"></a>

### stat-card.component.ts

- **Ruta:** [stat-card.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/stat-card/stat-card.component.ts) (`comercial-jhoel-app/src/app/shared/ui/stat-card/stat-card.component.ts`, 18 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Componente Angular: declara `StatCardComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [credibility.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-credibility-credibility-component-ts) (plantilla)
- **Plantilla:** [stat-card.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/stat-card/stat-card.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)

#### Clase `StatCardComponent` (L5–17)

- **Decoradores:** `@Component({ selector: 'app-stat-card', standalone: true, imports: [IconComponent], templateUrl: './stat-card.component.html', styleUrl: './stat-card.component.s`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@Input value: string`, `@Input label: string`, `@Input icon: string`
<a id="f-comercial-jhoel-app-src-app-shared-ui-summary-tile-summary-tile-component-ts"></a>

### summary-tile.component.ts

- **Ruta:** [summary-tile.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/summary-tile/summary-tile.component.ts) (`comercial-jhoel-app/src/app/shared/ui/summary-tile/summary-tile.component.ts`, 29 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Standard KPI tile (icon + title + value + optional description) used inside every `*-summary` component's `&lt;app-card&gt;` grid.
- **Depende de (archivos del proyecto):** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [account-type-summary.component.ts (plantilla)](dashboard-account-types.md#f-comercial-jhoel-app-src-app-features-dashboard-account-types-components-account-type-summary-account-type-summary-component-ts) (plantilla), [accounts-receivable-page.component.ts (plantilla)](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-accounts-receivable-page-component-ts) (plantilla), [assets-page.component.ts (plantilla)](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-assets-page-component-ts) (plantilla), [cuadre-agentes-page.component.ts (plantilla)](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts) (plantilla), [bank-summary.component.ts (plantilla)](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-summary-bank-summary-component-ts) (plantilla), [business-summary.component.ts (plantilla)](dashboard-businesses.md#f-comercial-jhoel-app-src-app-features-dashboard-businesses-components-business-summary-business-summary-component-ts) (plantilla), [catalog-product-requests-page.component.ts (plantilla)](dashboard-catalog-product-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-product-requests-catalog-product-requests-page-component-ts) (plantilla), [catalog-requests-page.component.ts (plantilla)](dashboard-catalog-requests.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-requests-catalog-requests-page-component-ts) (plantilla), [category-summary.component.ts (plantilla)](dashboard-categories.md#f-comercial-jhoel-app-src-app-features-dashboard-categories-components-category-summary-category-summary-component-ts) (plantilla), [client-summary.component.ts (plantilla)](dashboard-clients.md#f-comercial-jhoel-app-src-app-features-dashboard-clients-components-client-summary-client-summary-component-ts) (plantilla), [dashboard-home.component.ts (plantilla)](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts) (plantilla), [ice-cream-summary.component.ts (plantilla)](dashboard-ice-creams.md#f-comercial-jhoel-app-src-app-features-dashboard-ice-creams-inventory-components-ice-cream-summary-ice-cream-summary-component-ts) (plantilla), [inventory-summary.component.ts (plantilla)](dashboard-inventory.md#f-comercial-jhoel-app-src-app-features-dashboard-inventory-components-inventory-summary-inventory-summary-component-ts) (plantilla), [phones-summary.component.ts (plantilla)](dashboard-phones.md#f-comercial-jhoel-app-src-app-features-dashboard-phones-inventory-components-phones-summary-phones-summary-component-ts) (plantilla) y 7 más
- **Plantilla:** [summary-tile.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/summary-tile/summary-tile.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)

**Interfaces, tipos y enums:**

- `type SummaryTileTone` (L5) = `'primary' \| 'success' \| 'danger' \| 'gold' \| 'neutral'`

#### Clase `SummaryTileComponent` (L14–28)

- **Decoradores:** `@Component({ selector: 'app-summary-tile', standalone: true, imports: [IconComponent], templateUrl: './summary-tile.component.html', styleUrl: './summary-tile.co`
- **Propósito:** Standard KPI tile (icon + title + value + optional description) used inside every `*-summary` component's `&lt;app-card&gt;` grid. `tone` maps to the small, reusable semantic palette in `_tokens.scss` — never pick a color ad hoc per page, pick the tone that matches what the number means (success/danger/gold for money/neutral counts).
- **Datos / estado que administra:** `@Input icon: string`, `@Input title: string`, `@Input value: string`, `@Input description: string`, `@Input tone = 'primary'`
<a id="f-comercial-jhoel-app-src-app-shared-ui-toast-toast-container-component-ts"></a>

### toast-container.component.ts

- **Ruta:** [toast-container.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/toast/toast-container.component.ts) (`comercial-jhoel-app/src/app/shared/ui/toast/toast-container.component.ts`, 34 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Componente Angular: declara `ToastContainerComponent`, `ICON_BY_TYPE` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [app.component.ts (plantilla)](root.md#f-comercial-jhoel-app-src-app-app-component-ts) (plantilla)
- **Plantilla:** [toast-container.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/toast/toast-container.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="dismiss(toast.id)"`

#### Clase `ToastContainerComponent` (L13–33)

- **Decoradores:** `@Component({ selector: 'app-toast-container', standalone: true, imports: [IconComponent], templateUrl: './toast-container.component.html', styleUrl: './toast-con`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `notificationService = inject(NotificationService)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `iconFor` | método public | 26–28 | `type: string` | `string` |
| `dismiss` | método public | 30–32 | `id: string` | `void` |

##### `ToastContainerComponent.iconFor`

- **Firma:** `iconFor(type: string): string` — [toast-container.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/toast/toast-container.component.ts#L26) (L26–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `toast-container.component.html` (plantilla)

##### `ToastContainerComponent.dismiss`

- **Firma:** `dismiss(id: string): void` — [toast-container.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/toast/toast-container.component.ts#L30) (L30–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.notificationService.dismiss`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `toast-container.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-shared-ui-transaction-monthly-chart-transaction-monthly-chart-component-ts"></a>

### transaction-monthly-chart.component.ts

- **Ruta:** [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts) (`comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts`, 241 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Self-contained, like `TransactionSummaryCardComponent`/`SalesSummaryCardComponent` — fetches `BankDepositService.getDailyStats()` itself.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [bank-deposit.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [dashboard-home.component.ts (plantilla)](dashboard-home.md#f-comercial-jhoel-app-src-app-features-dashboard-home-dashboard-home-component-ts) (plantilla), [bank-deposits-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts) (plantilla), [transaccionar-page.component.ts (plantilla)](dashboard-transaccionar.md#f-comercial-jhoel-app-src-app-features-dashboard-transaccionar-transaccionar-page-component-ts) (plantilla)
- **Plantilla:** [transaction-monthly-chart.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.html) · **Usa componentes:** [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="retry()"`, `(mouseenter)="onPointHover(i)"`, `(mouseleave)="onPointLeave()"`

**Interfaces, tipos y enums:**

- `interface ChartPoint` (L17): sin documentación — miembros: `x`, `y`, `day`, `isMax`, `isMin`

#### Clase `TransactionMonthlyChartComponent` (L84–240)

- **Decoradores:** `@Component({ selector: 'app-transaction-monthly-chart', standalone: true, imports: [CardComponent, IconComponent, EmptyStateComponent, DatePipe], templateUrl: '.`
- **Propósito:** Self-contained, like `TransactionSummaryCardComponent`/`SalesSummaryCardComponent` — fetches `BankDepositService.getDailyStats()` itself. Used identically by Resumen, Transaccionar, and Reporte de Transacciones, which is what structurally guarantees the three screens can never disagree: there is exactly one place this data is fetched and rendered, not independent copies. Hand-rolled SVG rather than a charting library — this codebase has no chart dependency anywhere, and every existing visualization (tiles, tables) is a small custom component styled directly off the design tokens, not a themed third-party widget.
- **Servicios inyectados con `inject()`:** `bankDepositService = inject(BankDepositService)`
- **Datos / estado que administra:** `loading = signal(true)`, `loadError = signal(false)`, `days = signal<BankDepositDailyStat[]>([])`, `monthLabel = signal<string \| null>(null)`, `hoveredIndex = signal<number \| null>(null)`, `hasActivity = computed(() => this.days().some((d) => d.transacti`, `maxValue = computed(() => this.days().reduce((max, d) => Math`, `maxIndex = computed(() => { const days = this.days(); if (day`, `minIndex = computed(() => { const days = this.days(); if (day`, `maxDay = computed(() => (this.maxIndex() >= 0 ? this.days()`, `minDay = computed(() => (this.minIndex() >= 0 ? this.days()`, `axisMax = computed(() => computeYAxisMax(this.maxValue()))`, `yAxisTicks = computed(() => buildYAxisTicks(this.axisMax()))`, `points = computed<ChartPoint[]>(() => { const days = this.d`, `linePath = computed(() => buildSmoothPath(this.points()))`, `areaPath = computed(() => { const points = this.points(); if `, `labelPoints = computed(() => this.points().filter((p, i, all) =>`, `hoveredPoint = computed(() => { const index = this.hoveredIndex()`, `todayMarker = computed(() => { const todayIso = todayIsoDate(); `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetch` | método private | 191–205 | — | `void` |
| `retry` | método public | 207–209 | — | `void` |
| `tickY` | método public | 212–216 | `tick: number` | `number` |
| `onPointHover` | método public | 218–220 | `index: number` | `void` |
| `onPointLeave` | método public | 222–224 | — | `void` |
| `todayMarkerPoints` | método public | 227–231 | `x: number`, `y: number` | `string` |
| `leftPercent` | método public | 233–235 | `x: number` | `number` |
| `topPercent` | método public | 237–239 | `y: number` | `number` |

##### `TransactionMonthlyChartComponent.fetch`

- **Firma:** `fetch(): void` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L191) (L191–205)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.loadError.set`, `this.bankDepositService.getDailyStats().subscribe`, `this.bankDepositService.getDailyStats`, `this.days.set`, `this.monthLabel.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.loadError.set`, `this.days.set`, `this.monthLabel.set`
- **Consumidores:** (mismo archivo)

##### `TransactionMonthlyChartComponent.retry`

- **Firma:** `retry(): void` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L207) (L207–209)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.fetch`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaction-monthly-chart.component.html` (plantilla)

##### `TransactionMonthlyChartComponent.tickY`

- **Firma:** `tickY(tick: number): number` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L212) (L212–216)
- **Propósito / descripción:** SVG y-coordinate for a given Y-axis tick value — the last (top) tick always equals `axisMax` by construction of `buildYAxisTicks`.
- **Dependencias (llamadas en su cuerpo):** `this.yAxisTicks`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaction-monthly-chart.component.html` (plantilla)

##### `TransactionMonthlyChartComponent.onPointHover`

- **Firma:** `onPointHover(index: number): void` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L218) (L218–220)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.hoveredIndex.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.hoveredIndex.set`
- **Consumidores:** `transaction-monthly-chart.component.html` (plantilla)

##### `TransactionMonthlyChartComponent.onPointLeave`

- **Firma:** `onPointLeave(): void` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L222) (L222–224)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.hoveredIndex.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.hoveredIndex.set`
- **Consumidores:** `transaction-monthly-chart.component.html` (plantilla)

##### `TransactionMonthlyChartComponent.todayMarkerPoints`

- **Firma:** `todayMarkerPoints(x: number, y: number): string` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L227) (L227–231)
- **Propósito / descripción:** Small downward-pointing triangle hovering just above the trend line at (x, y) — rides the curve's own height at today's column, like a pin marking that exact point from above.
- **Dependencias (llamadas en su cuerpo):** `(x - 4).toFixed`, `(x + 4).toFixed`, `x.toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaction-monthly-chart.component.html` (plantilla)

##### `TransactionMonthlyChartComponent.leftPercent`

- **Firma:** `leftPercent(x: number): number` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L233) (L233–235)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaction-monthly-chart.component.html` (plantilla)

##### `TransactionMonthlyChartComponent.topPercent`

- **Firma:** `topPercent(y: number): number` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L237) (L237–239)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `transaction-monthly-chart.component.html` (plantilla)

#### Función `computeYAxisMax` (L26–34)

- **Tipo:** función local del archivo
- **Firma:** `computeYAxisMax(rawMax: number): number` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L26)
- **Propósito / descripción:** "Nice" round ticks (1/2/5 × 10^n) for the Y axis — never a fixed scale, always derived from the real max.
- **Dependencias:** `Math.pow`, `Math.floor`, `Math.log10`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildYAxisTicks` (L37–39)

- **Tipo:** función local del archivo
- **Firma:** `buildYAxisTicks(axisMax: number): number[]` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L37)
- **Propósito / descripción:** Just 0 / half / max — a compact chart reads better with fewer gridlines.
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `todayIsoDate` (L42–48)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L42)
- **Propósito / descripción:** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique every other date-driven piece of this codebase uses. Purely a presentational "which column is today" lookup, not a data/business-date decision (the series itself is always the server's own current month, see `BankDepositService.getDailyStats()`).
- **Dependencias:** `new Date`, `now.getFullYear`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [bank-deposits-report-page.component.ts (plantilla)](dashboard-reports.md#f-comercial-jhoel-app-src-app-features-dashboard-reports-bank-deposits-bank-deposits-report-page-component-ts)

#### Función `buildSmoothPath` (L51–70)

- **Tipo:** función local del archivo
- **Firma:** `buildSmoothPath(points: { x: number; y: number }[]): string` — [transaction-monthly-chart.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/transaction-monthly-chart/transaction-monthly-chart.component.ts#L51)
- **Propósito / descripción:** Catmull-Rom → cubic Bezier, uniform tension — passes exactly through every point (peaks/valleys stay numerically exact), only the connecting segments are curved instead of straight. Standard 1/6 control-point scaling.
- **Dependencias:** `points[0].x.toFixed`, `points[0].y.toFixed`, `cp1x.toFixed`, `cp1y.toFixed`, `cp2x.toFixed`, `cp2y.toFixed`, `p2.x.toFixed`, `p2.y.toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-shared-ui-update-available-banner-update-available-banner-component-ts"></a>

### update-available-banner.component.ts

- **Ruta:** [update-available-banner.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/update-available-banner/update-available-banner.component.ts) (`comercial-jhoel-app/src/app/shared/ui/update-available-banner/update-available-banner.component.ts`, 37 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-ui`
- **Responsabilidad:** Mostrado solo cuando `AppUpdateService` detectó una versión nueva PERO no pudo activarla sola porque hay un borrador con datos sin guardar (Ventas, Compras, Transaccionar, Cuadre de Bancos, Heladería) — en cualquier otro caso (landing pública, dashboard sin operación en curso) la actualización ya ocurrió sin que el usuario tuviera que hacer nada, y este banner nunca llega a aparecer.
- **Depende de (archivos del proyecto):** [app-update.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-app-update-service-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [app.component.ts (plantilla)](root.md#f-comercial-jhoel-app-src-app-app-component-ts) (plantilla)
- **Plantilla:** [update-available-banner.component.html](../../../../comercial-jhoel-app/src/app/shared/ui/update-available-banner/update-available-banner.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="updateNow()"`, `(click)="dismiss()"`

#### Clase `UpdateAvailableBannerComponent` (L16–36)

- **Decoradores:** `@Component({ selector: 'app-update-available-banner', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './update-available-banner.compon`
- **Propósito:** Mostrado solo cuando `AppUpdateService` detectó una versión nueva PERO no pudo activarla sola porque hay un borrador con datos sin guardar (Ventas, Compras, Transaccionar, Cuadre de Bancos, Heladería) — en cualquier otro caso (landing pública, dashboard sin operación en curso) la actualización ya ocurrió sin que el usuario tuviera que hacer nada, y este banner nunca llega a aparecer. Montado una sola vez en `AppComponent`, igual que `ToastContainerComponent`.
- **Servicios inyectados con `inject()`:** `appUpdateService = inject(AppUpdateService)`
- **Datos / estado que administra:** `visible = computed(() => this.appUpdateService.updateReady()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `updateNow` | método public | 29–31 | — | `void` |
| `dismiss` | método public | 33–35 | — | `void` |

##### `UpdateAvailableBannerComponent.updateNow`

- **Firma:** `updateNow(): void` — [update-available-banner.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/update-available-banner/update-available-banner.component.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.appUpdateService.applyUpdate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `update-available-banner.component.html` (plantilla)

##### `UpdateAvailableBannerComponent.dismiss`

- **Firma:** `dismiss(): void` — [update-available-banner.component.ts](../../../../comercial-jhoel-app/src/app/shared/ui/update-available-banner/update-available-banner.component.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.appUpdateService.dismiss`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `update-available-banner.component.html` (plantilla)

