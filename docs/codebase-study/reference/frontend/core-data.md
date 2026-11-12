# Frontend `core-data`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [bank-operations.data.ts](#f-comercial-jhoel-app-src-app-core-data-bank-operations-data-ts) | .ts | Código TypeScript | Core (servicios, modelos, guards) | Código TypeScript: declara `BANK_OPERATIONS`, `BANK_TRUST_POINTS` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [catalog-categories.data.ts](#f-comercial-jhoel-app-src-app-core-data-catalog-categories-data-ts) | .ts | Código TypeScript | Core (servicios, modelos, guards) | Código TypeScript: declara `CATALOG_CATEGORIES` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [contact-channels.data.ts](#f-comercial-jhoel-app-src-app-core-data-contact-channels-data-ts) | .ts | Código TypeScript | Core (servicios, modelos, guards) | `CONTACT_CHANNELS`/`SOCIAL_LINKS` used to live here as hardcoded placeholders — removed once `ContactService` started building them dynamically from the real `company_settings` data (`PublicCompanyInfo`, via `CompanySettingsService.getPublicInfo()`). | 0 internas | 1 | Baja (1 consumidores) |
| [dashboard-nav.data.ts](#f-comercial-jhoel-app-src-app-core-data-dashboard-nav-data-ts) | .ts | Código TypeScript | Core (servicios, modelos, guards) | Código TypeScript: declara `ADMIN_ONLY`, `DASHBOARD_NAV_ITEMS` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [dashboard-summary.data.ts](#f-comercial-jhoel-app-src-app-core-data-dashboard-summary-data-ts) | .ts | Código TypeScript | Core (servicios, modelos, guards) | Código TypeScript: declara `DASHBOARD_SUMMARY` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [index.ts](#f-comercial-jhoel-app-src-app-core-data-index-ts) | .ts | Barrel (re-exportación) | Core (servicios, modelos, guards) | Barrel (re-exportación) (sin comentario de documentación en el código). | 9 internas | 13 | Alta (13 consumidores) |
| [nav-links.data.ts](#f-comercial-jhoel-app-src-app-core-data-nav-links-data-ts) | .ts | Código TypeScript | Core (servicios, modelos, guards) | Código TypeScript: declara `NAV_LINKS`, `NAV_LOGIN_LINK`, `NAV_CTA_LINK` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [services.data.ts](#f-comercial-jhoel-app-src-app-core-data-services-data-ts) | .ts | Código TypeScript | Core (servicios, modelos, guards) | Código TypeScript: declara `SERVICES` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |
| [site.data.ts](#f-comercial-jhoel-app-src-app-core-data-site-data-ts) | .ts | Código TypeScript | Core (servicios, modelos, guards) | Global brand/business info. | 0 internas | 1 | Baja (1 consumidores) |
| [stats.data.ts](#f-comercial-jhoel-app-src-app-core-data-stats-data-ts) | .ts | Código TypeScript | Core (servicios, modelos, guards) | Código TypeScript: declara `STATS` (sin comentario de documentación en el código). | 1 internas | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-core-data-bank-operations-data-ts"></a>

### bank-operations.data.ts

- **Ruta:** [bank-operations.data.ts](../../../../comercial-jhoel-app/src/app/core/data/bank-operations.data.ts) (`comercial-jhoel-app/src/app/core/data/bank-operations.data.ts`, 17 líneas)
- **Tipo:** Código TypeScript · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-data`
- **Responsabilidad:** Código TypeScript: declara `BANK_OPERATIONS`, `BANK_TRUST_POINTS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Consumidores:** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)

**Constantes exportadas:**

- `BANK_OPERATIONS` (L3) = `[ { id: 'depositos', icon: 'arrow-down-circle', label: 'Depósitos en cuenta' }, { id: 'retiros', icon: 'arrow-`
- `BANK_TRUST_POINTS` (L12) = `[ { id: 'seguro', icon: 'shield-check', text: 'Operaciones respaldadas y verificadas al instante' }, { id: 'si`
<a id="f-comercial-jhoel-app-src-app-core-data-catalog-categories-data-ts"></a>

### catalog-categories.data.ts

- **Ruta:** [catalog-categories.data.ts](../../../../comercial-jhoel-app/src/app/core/data/catalog-categories.data.ts) (`comercial-jhoel-app/src/app/core/data/catalog-categories.data.ts`, 47 líneas)
- **Tipo:** Código TypeScript · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-data`
- **Responsabilidad:** Código TypeScript: declara `CATALOG_CATEGORIES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Consumidores:** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)

**Constantes exportadas:**

- `CATALOG_CATEGORIES` (L3) = `[ { id: 'utiles-escolares', icon: 'book', name: 'Útiles escolares', description: 'Cuadernos, lápices, mochilas`
<a id="f-comercial-jhoel-app-src-app-core-data-contact-channels-data-ts"></a>

### contact-channels.data.ts

- **Ruta:** [contact-channels.data.ts](../../../../comercial-jhoel-app/src/app/core/data/contact-channels.data.ts) (`comercial-jhoel-app/src/app/core/data/contact-channels.data.ts`, 16 líneas)
- **Tipo:** Código TypeScript · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-data`
- **Responsabilidad:** `CONTACT_CHANNELS`/`SOCIAL_LINKS` used to live here as hardcoded placeholders — removed once `ContactService` started building them dynamically from the real `company_settings` data (`PublicCompanyInfo`, via `CompanySettingsService.getPublicInfo()`).
- **Descripción del autor (comentario del archivo):** `CONTACT_CHANNELS`/`SOCIAL_LINKS` used to live here as hardcoded placeholders — removed once `ContactService` started building them dynamically from the real `company_settings` data (`PublicCompanyInfo`, via `CompanySettingsService.getPublicInfo()`). See `core/services/contact.service.ts`.
- **Consumidores:** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)

**Constantes exportadas:**

- `CONTACT_INTERESTS` (L8): `CONTACT_CHANNELS`/`SOCIAL_LINKS` used to live here as hardcoded placeholders — removed once `ContactService` started building them dynamically from the real `company_settings` data (`PublicCompanyInfo`, via `CompanySettingsService.getPublicInfo()`). = `[ 'Útiles escolares', 'Fotocopias e impresiones', 'Agente bancario', 'Servicios administrativos', 'Venta de te`
<a id="f-comercial-jhoel-app-src-app-core-data-dashboard-nav-data-ts"></a>

### dashboard-nav.data.ts

- **Ruta:** [dashboard-nav.data.ts](../../../../comercial-jhoel-app/src/app/core/data/dashboard-nav.data.ts) (`comercial-jhoel-app/src/app/core/data/dashboard-nav.data.ts`, 205 líneas)
- **Tipo:** Código TypeScript · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-data`
- **Responsabilidad:** Código TypeScript: declara `ADMIN_ONLY`, `DASHBOARD_NAV_ITEMS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Consumidores:** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts), [shortcut-route-options.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-shortcut-route-options-ts)

**Constantes exportadas:**

- `DASHBOARD_NAV_ITEMS` (L13): Sidebar clasificado por tipo. = `[ { label: 'Resumen', icon: 'grid', path: '' }, { label: 'Ventas y Compras', icon: 'shopping-bag', path: 'grup`
<a id="f-comercial-jhoel-app-src-app-core-data-dashboard-summary-data-ts"></a>

### dashboard-summary.data.ts

- **Ruta:** [dashboard-summary.data.ts](../../../../comercial-jhoel-app/src/app/core/data/dashboard-summary.data.ts) (`comercial-jhoel-app/src/app/core/data/dashboard-summary.data.ts`, 38 líneas)
- **Tipo:** Código TypeScript · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-data`
- **Responsabilidad:** Código TypeScript: declara `DASHBOARD_SUMMARY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Consumidores:** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)

**Constantes exportadas:**

- `DASHBOARD_SUMMARY` (L4): Mock figures — phase 2 replaces these with real aggregates from the backend. = `[ { id: 'sistema', icon: 'briefcase', title: 'Sistema', value: '4', description: 'módulos activos', path: 'sis`
<a id="f-comercial-jhoel-app-src-app-core-data-index-ts"></a>

### index.ts

- **Ruta:** [index.ts](../../../../comercial-jhoel-app/src/app/core/data/index.ts) (`comercial-jhoel-app/src/app/core/data/index.ts`, 10 líneas)
- **Tipo:** Barrel (re-exportación) · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-data`
- **Responsabilidad:** Barrel (re-exportación) (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [site.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-site-data-ts), [nav-links.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-nav-links-data-ts), [services.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-services-data-ts), [stats.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-stats-data-ts), [catalog-categories.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-catalog-categories-data-ts), [bank-operations.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-bank-operations-data-ts), [contact-channels.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-contact-channels-data-ts), [dashboard-nav.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-dashboard-nav-data-ts), [dashboard-summary.data.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-dashboard-summary-data-ts)
- **Consumidores:** [bank-agent.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-agent-service-ts), [catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-service-ts), [contact.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-contact-service-ts), [dashboard-summary.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-dashboard-summary-service-ts), [offers.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-offers-service-ts), [stats.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-stats-service-ts), [login-page.component.ts](auth.md#f-comercial-jhoel-app-src-app-features-auth-login-login-page-component-ts), [catalog-page.component.ts](catalog.md#f-comercial-jhoel-app-src-app-features-catalog-catalog-page-component-ts), [dashboard-sidebar.component.ts](dashboard-sidebar.md#f-comercial-jhoel-app-src-app-features-dashboard-sidebar-dashboard-sidebar-component-ts), [bank-agents.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts), [hero.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts), [footer.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-footer-footer-component-ts), [navbar.component.ts](layout.md#f-comercial-jhoel-app-src-app-layout-navbar-navbar-component-ts)
<a id="f-comercial-jhoel-app-src-app-core-data-nav-links-data-ts"></a>

### nav-links.data.ts

- **Ruta:** [nav-links.data.ts](../../../../comercial-jhoel-app/src/app/core/data/nav-links.data.ts) (`comercial-jhoel-app/src/app/core/data/nav-links.data.ts`, 30 líneas)
- **Tipo:** Código TypeScript · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-data`
- **Responsabilidad:** Código TypeScript: declara `NAV_LINKS`, `NAV_LOGIN_LINK`, `NAV_CTA_LINK` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Consumidores:** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)

**Constantes exportadas:**

- `NAV_LINKS` (L3) = `[ { label: 'Inicio', path: '/', fragment: 'inicio' }, { label: 'Servicios', path: '/', fragment: 'servicios', `
- `NAV_LOGIN_LINK` (L28) = `{ label: 'Iniciar sesión', path: '/login' }`
- `NAV_CTA_LINK` (L29) = `{ label: 'Ver catálogo', path: '/catalogo', isCta: true }`
<a id="f-comercial-jhoel-app-src-app-core-data-services-data-ts"></a>

### services.data.ts

- **Ruta:** [services.data.ts](../../../../comercial-jhoel-app/src/app/core/data/services.data.ts) (`comercial-jhoel-app/src/app/core/data/services.data.ts`, 60 líneas)
- **Tipo:** Código TypeScript · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-data`
- **Responsabilidad:** Código TypeScript: declara `SERVICES` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Consumidores:** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)

**Constantes exportadas:**

- `SERVICES` (L3) = `[ { id: 'utiles-escolares', icon: 'book', title: 'Útiles escolares', description: 'Todo lo que tu familia nece`
<a id="f-comercial-jhoel-app-src-app-core-data-site-data-ts"></a>

### site.data.ts

- **Ruta:** [site.data.ts](../../../../comercial-jhoel-app/src/app/core/data/site.data.ts) (`comercial-jhoel-app/src/app/core/data/site.data.ts`, 15 líneas)
- **Tipo:** Código TypeScript · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-data`
- **Responsabilidad:** Global brand/business info.
- **Consumidores:** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)

**Constantes exportadas:**

- `SITE` (L2): Global brand/business info. = `{ name: 'Comercial Jhoel', tagline: 'Construyendo confianza, generando valor', description: 'Librería, útiles `
<a id="f-comercial-jhoel-app-src-app-core-data-stats-data-ts"></a>

### stats.data.ts

- **Ruta:** [stats.data.ts](../../../../comercial-jhoel-app/src/app/core/data/stats.data.ts) (`comercial-jhoel-app/src/app/core/data/stats.data.ts`, 9 líneas)
- **Tipo:** Código TypeScript · **Capa:** Core (servicios, modelos, guards) · **Módulo:** Frontend `core-data`
- **Responsabilidad:** Código TypeScript: declara `STATS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts)
- **Consumidores:** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts)

**Constantes exportadas:**

- `STATS` (L3) = `[ { id: 'anios', value: '+10', label: 'años de experiencia', icon: 'sparkles' }, { id: 'clientes', value: '+8,`
