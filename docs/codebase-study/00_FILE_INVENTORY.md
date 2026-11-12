# Inventario de archivos

Resumen del inventario completo. El detalle archivo por archivo (ruta, extensión, tipo, capa, responsabilidad, dependencias, consumidores, importancia) está al inicio de cada documento de módulo.

- Archivos TypeScript analizados: **2325** (clases: 2143, métodos: 5099, funciones: 604, interfaces: 1496).
- Plantillas HTML: **379**. Otros (SCSS, SQL, shell, JSON de configuración de pruebas): **384**.
- Endpoints HTTP: **440** ([12_API_ENDPOINTS.md](12_API_ENDPOINTS.md)).
- Excluido: `node_modules`, `dist`, `.angular`, `coverage`, `src/assets` (imágenes/fuentes) y archivos de configuración del tooling fuera de `src` (ver [01_PROJECT_OVERVIEW.md](01_PROJECT_OVERVIEW.md)).

**Importancia** es una heurística: cantidad de consumidores por import, más el papel del archivo (arranque, controlador, caso de uso). Sirve para priorizar el estudio, no es una métrica oficial.

| Área | Módulo | Archivos | Documento |
|---|---|---|---|
| Backend | Configuración del backend | 1 | [abrir](reference/backend/config.md) |
| Backend | Base de datos: data-source y seeds | 2 | [abrir](reference/backend/database.md) |
| Backend | Pruebas E2E del backend | 10 | [abrir](reference/backend/e2e.md) |
| Backend | Health check | 2 | [abrir](reference/backend/health.md) |
| Backend | Migraciones TypeORM (esquema de base de datos) | 112 | [abrir](reference/backend/migrations.md) |
| Backend | Raíz del backend (main, AppModule) | 2 | [abrir](reference/backend/root.md) |
| Backend | Código transversal del backend (shared) | 14 | [abrir](reference/backend/shared.md) |
| Backend | Scripts y pruebas SQL | 16 | [abrir](reference/backend/sql.md) |
| Backend | Módulo backend `account-types` | 19 | [abrir](reference/backend/account-types.md) |
| Backend | Módulo backend `accounts-receivable` | 37 | [abrir](reference/backend/accounts-receivable.md) |
| Backend | Módulo backend `alert-settings` | 15 | [abrir](reference/backend/alert-settings.md) |
| Backend | Módulo backend `alerts` | 18 | [abrir](reference/backend/alerts.md) |
| Backend | Módulo backend `assets` | 29 | [abrir](reference/backend/assets.md) |
| Backend | Módulo backend `auth` | 13 | [abrir](reference/backend/auth.md) |
| Backend | Módulo backend `bank-deposits` | 54 | [abrir](reference/backend/bank-deposits.md) |
| Backend | Módulo backend `banks` | 108 | [abrir](reference/backend/banks.md) |
| Backend | Módulo backend `businesses` | 19 | [abrir](reference/backend/businesses.md) |
| Backend | Módulo backend `cash-control` | 22 | [abrir](reference/backend/cash-control.md) |
| Backend | Módulo backend `catalog` | 61 | [abrir](reference/backend/catalog.md) |
| Backend | Módulo backend `catalog-banks` | 30 | [abrir](reference/backend/catalog-banks.md) |
| Backend | Módulo backend `categories` | 19 | [abrir](reference/backend/categories.md) |
| Backend | Módulo backend `clients` | 19 | [abrir](reference/backend/clients.md) |
| Backend | Módulo backend `company-settings` | 18 | [abrir](reference/backend/company-settings.md) |
| Backend | Módulo backend `dashboard` | 9 | [abrir](reference/backend/dashboard.md) |
| Backend | Módulo backend `financial-day-review` | 11 | [abrir](reference/backend/financial-day-review.md) |
| Backend | Módulo backend `guayacan-cash-box` | 21 | [abrir](reference/backend/guayacan-cash-box.md) |
| Backend | Módulo backend `ice-creams` | 62 | [abrir](reference/backend/ice-creams.md) |
| Backend | Módulo backend `inventory` | 44 | [abrir](reference/backend/inventory.md) |
| Backend | Módulo backend `keyboard-shortcuts` | 21 | [abrir](reference/backend/keyboard-shortcuts.md) |
| Backend | Módulo backend `landing-backgrounds` | 30 | [abrir](reference/backend/landing-backgrounds.md) |
| Backend | Módulo backend `likes` | 6 | [abrir](reference/backend/likes.md) |
| Backend | Módulo backend `news` | 33 | [abrir](reference/backend/news.md) |
| Backend | Módulo backend `news-subscriptions` | 36 | [abrir](reference/backend/news-subscriptions.md) |
| Backend | Módulo backend `news-types` | 24 | [abrir](reference/backend/news-types.md) |
| Backend | Módulo backend `phones` | 45 | [abrir](reference/backend/phones.md) |
| Backend | Módulo backend `presentation-types` | 20 | [abrir](reference/backend/presentation-types.md) |
| Backend | Módulo backend `product-catalog` | 49 | [abrir](reference/backend/product-catalog.md) |
| Backend | Módulo backend `products` | 31 | [abrir](reference/backend/products.md) |
| Backend | Módulo backend `purchases` | 46 | [abrir](reference/backend/purchases.md) |
| Backend | Módulo backend `quotations` | 33 | [abrir](reference/backend/quotations.md) |
| Backend | Módulo backend `recharge-cash-box` | 35 | [abrir](reference/backend/recharge-cash-box.md) |
| Backend | Módulo backend `recharges` | 193 | [abrir](reference/backend/recharges.md) |
| Backend | Módulo backend `reports` | 82 | [abrir](reference/backend/reports.md) |
| Backend | Módulo backend `roles` | 23 | [abrir](reference/backend/roles.md) |
| Backend | Módulo backend `sales` | 49 | [abrir](reference/backend/sales.md) |
| Backend | Módulo backend `sales-cash-box` | 22 | [abrir](reference/backend/sales-cash-box.md) |
| Backend | Módulo backend `sales-register` | 8 | [abrir](reference/backend/sales-register.md) |
| Backend | Módulo backend `site-visits` | 7 | [abrir](reference/backend/site-visits.md) |
| Backend | Módulo backend `suppliers` | 19 | [abrir](reference/backend/suppliers.md) |
| Backend | Módulo backend `tickets` | 31 | [abrir](reference/backend/tickets.md) |
| Backend | Módulo backend `transaction-banks` | 30 | [abrir](reference/backend/transaction-banks.md) |
| Backend | Módulo backend `transaction-types` | 21 | [abrir](reference/backend/transaction-types.md) |
| Backend | Módulo backend `units-of-measure` | 20 | [abrir](reference/backend/units-of-measure.md) |
| Backend | Módulo backend `users` | 28 | [abrir](reference/backend/users.md) |
| Frontend | Entornos del frontend | 2 | [abrir](reference/frontend/environments.md) |
| Frontend | Raíz del frontend (bootstrap, rutas, configuración) | 7 | [abrir](reference/frontend/root.md) |
| Frontend | Estilos globales del frontend | 6 | [abrir](reference/frontend/styles.md) |
| Frontend | Frontend `auth` | 3 | [abrir](reference/frontend/auth.md) |
| Frontend | Frontend `catalog` | 3 | [abrir](reference/frontend/catalog.md) |
| Frontend | Frontend `core-data` | 10 | [abrir](reference/frontend/core-data.md) |
| Frontend | Frontend `core-guards` | 3 | [abrir](reference/frontend/core-guards.md) |
| Frontend | Frontend `core-interceptors` | 3 | [abrir](reference/frontend/core-interceptors.md) |
| Frontend | Frontend `core-models` | 69 | [abrir](reference/frontend/core-models.md) |
| Frontend | Frontend `core-services` | 97 | [abrir](reference/frontend/core-services.md) |
| Frontend | Frontend `core-utils` | 11 | [abrir](reference/frontend/core-utils.md) |
| Frontend | Frontend `dashboard` | 3 | [abrir](reference/frontend/dashboard.md) |
| Frontend | Frontend `dashboard-account-types` | 18 | [abrir](reference/frontend/dashboard-account-types.md) |
| Frontend | Frontend `dashboard-accounts-receivable` | 26 | [abrir](reference/frontend/dashboard-accounts-receivable.md) |
| Frontend | Frontend `dashboard-alert-settings` | 3 | [abrir](reference/frontend/dashboard-alert-settings.md) |
| Frontend | Frontend `dashboard-assets` | 12 | [abrir](reference/frontend/dashboard-assets.md) |
| Frontend | Frontend `dashboard-bank-agents` | 28 | [abrir](reference/frontend/dashboard-bank-agents.md) |
| Frontend | Frontend `dashboard-bank-transfers` | 7 | [abrir](reference/frontend/dashboard-bank-transfers.md) |
| Frontend | Frontend `dashboard-banks` | 18 | [abrir](reference/frontend/dashboard-banks.md) |
| Frontend | Frontend `dashboard-businesses` | 18 | [abrir](reference/frontend/dashboard-businesses.md) |
| Frontend | Frontend `dashboard-cash-control` | 48 | [abrir](reference/frontend/dashboard-cash-control.md) |
| Frontend | Frontend `dashboard-catalog-banks` | 15 | [abrir](reference/frontend/dashboard-catalog-banks.md) |
| Frontend | Frontend `dashboard-catalog-phones` | 12 | [abrir](reference/frontend/dashboard-catalog-phones.md) |
| Frontend | Frontend `dashboard-catalog-product-requests` | 9 | [abrir](reference/frontend/dashboard-catalog-product-requests.md) |
| Frontend | Frontend `dashboard-catalog-products` | 12 | [abrir](reference/frontend/dashboard-catalog-products.md) |
| Frontend | Frontend `dashboard-catalog-requests` | 9 | [abrir](reference/frontend/dashboard-catalog-requests.md) |
| Frontend | Frontend `dashboard-categories` | 18 | [abrir](reference/frontend/dashboard-categories.md) |
| Frontend | Frontend `dashboard-change-password-modal` | 3 | [abrir](reference/frontend/dashboard-change-password-modal.md) |
| Frontend | Frontend `dashboard-clients` | 18 | [abrir](reference/frontend/dashboard-clients.md) |
| Frontend | Frontend `dashboard-closed-days` | 12 | [abrir](reference/frontend/dashboard-closed-days.md) |
| Frontend | Frontend `dashboard-company-settings` | 3 | [abrir](reference/frontend/dashboard-company-settings.md) |
| Frontend | Frontend `dashboard-financial-day-review` | 16 | [abrir](reference/frontend/dashboard-financial-day-review.md) |
| Frontend | Frontend `dashboard-graphs` | 36 | [abrir](reference/frontend/dashboard-graphs.md) |
| Frontend | Frontend `dashboard-guayacan-cash-box` | 21 | [abrir](reference/frontend/dashboard-guayacan-cash-box.md) |
| Frontend | Frontend `dashboard-guayacan-cash-counts` | 4 | [abrir](reference/frontend/dashboard-guayacan-cash-counts.md) |
| Frontend | Frontend `dashboard-home` | 9 | [abrir](reference/frontend/dashboard-home.md) |
| Frontend | Frontend `dashboard-ice-creams` | 51 | [abrir](reference/frontend/dashboard-ice-creams.md) |
| Frontend | Frontend `dashboard-inventory` | 36 | [abrir](reference/frontend/dashboard-inventory.md) |
| Frontend | Frontend `dashboard-keyboard-shortcuts` | 3 | [abrir](reference/frontend/dashboard-keyboard-shortcuts.md) |
| Frontend | Frontend `dashboard-landing-backgrounds` | 15 | [abrir](reference/frontend/dashboard-landing-backgrounds.md) |
| Frontend | Frontend `dashboard-news` | 12 | [abrir](reference/frontend/dashboard-news.md) |
| Frontend | Frontend `dashboard-news-subscribers` | 9 | [abrir](reference/frontend/dashboard-news-subscribers.md) |
| Frontend | Frontend `dashboard-news-types` | 9 | [abrir](reference/frontend/dashboard-news-types.md) |
| Frontend | Frontend `dashboard-phones` | 33 | [abrir](reference/frontend/dashboard-phones.md) |
| Frontend | Frontend `dashboard-placeholder-page` | 3 | [abrir](reference/frontend/dashboard-placeholder-page.md) |
| Frontend | Frontend `dashboard-presentation-units` | 9 | [abrir](reference/frontend/dashboard-presentation-units.md) |
| Frontend | Frontend `dashboard-purchases` | 18 | [abrir](reference/frontend/dashboard-purchases.md) |
| Frontend | Frontend `dashboard-purchases-admin` | 9 | [abrir](reference/frontend/dashboard-purchases-admin.md) |
| Frontend | Frontend `dashboard-quotations` | 18 | [abrir](reference/frontend/dashboard-quotations.md) |
| Frontend | Frontend `dashboard-recharge-cash-box` | 15 | [abrir](reference/frontend/dashboard-recharge-cash-box.md) |
| Frontend | Frontend `dashboard-recharge-days` | 12 | [abrir](reference/frontend/dashboard-recharge-days.md) |
| Frontend | Frontend `dashboard-recharges` | 54 | [abrir](reference/frontend/dashboard-recharges.md) |
| Frontend | Frontend `dashboard-recharges-sim-sales-admin` | 9 | [abrir](reference/frontend/dashboard-recharges-sim-sales-admin.md) |
| Frontend | Frontend `dashboard-reports` | 61 | [abrir](reference/frontend/dashboard-reports.md) |
| Frontend | Frontend `dashboard-roles` | 18 | [abrir](reference/frontend/dashboard-roles.md) |
| Frontend | Frontend `dashboard-sales` | 18 | [abrir](reference/frontend/dashboard-sales.md) |
| Frontend | Frontend `dashboard-sales-admin` | 9 | [abrir](reference/frontend/dashboard-sales-admin.md) |
| Frontend | Frontend `dashboard-sales-register` | 9 | [abrir](reference/frontend/dashboard-sales-register.md) |
| Frontend | Frontend `dashboard-sidebar` | 3 | [abrir](reference/frontend/dashboard-sidebar.md) |
| Frontend | Frontend `dashboard-suppliers` | 18 | [abrir](reference/frontend/dashboard-suppliers.md) |
| Frontend | Frontend `dashboard-tickets` | 18 | [abrir](reference/frontend/dashboard-tickets.md) |
| Frontend | Frontend `dashboard-topbar` | 6 | [abrir](reference/frontend/dashboard-topbar.md) |
| Frontend | Frontend `dashboard-transaccionar` | 39 | [abrir](reference/frontend/dashboard-transaccionar.md) |
| Frontend | Frontend `dashboard-transaction-banks` | 21 | [abrir](reference/frontend/dashboard-transaction-banks.md) |
| Frontend | Frontend `dashboard-transaction-days` | 12 | [abrir](reference/frontend/dashboard-transaction-days.md) |
| Frontend | Frontend `dashboard-transaction-types` | 18 | [abrir](reference/frontend/dashboard-transaction-types.md) |
| Frontend | Frontend `dashboard-users` | 18 | [abrir](reference/frontend/dashboard-users.md) |
| Frontend | Frontend `landing` | 82 | [abrir](reference/frontend/landing.md) |
| Frontend | Frontend `layout` | 9 | [abrir](reference/frontend/layout.md) |
| Frontend | Frontend `news-detail` | 3 | [abrir](reference/frontend/news-detail.md) |
| Frontend | Frontend `news-preferences` | 3 | [abrir](reference/frontend/news-preferences.md) |
| Frontend | Frontend `shared-directives` | 6 | [abrir](reference/frontend/shared-directives.md) |
| Frontend | Frontend `shared-ui` | 81 | [abrir](reference/frontend/shared-ui.md) |
