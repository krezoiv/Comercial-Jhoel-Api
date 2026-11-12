# Frontend `landing`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [quick-access-dock.component.ts](#f-comercial-jhoel-app-src-app-features-landing-components-quick-access-dock-quick-access-dock-component-ts) | .ts | Componente Angular | Feature (pantalla) | Dock flotante de acceso rápido de la landing — SOLO navegación: no duplica catálogos, cards, WhatsApp ni Notificaciones. | 4 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [landing-page.component.ts](#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `LandingPageComponent` (sin comentario de documentación en el código). | 14 internas; ext.: @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [about.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-about-about-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `AboutComponent`, `Value` (sin comentario de documentación en el código). | 4 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [bank-agents.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Agentes Bancarios" — sección pública única que fusiona lo que antes eran dos secciones separadas: esta misma (la oferta de servicio propio como agente bancario) y "Bancos" (el catálogo de entidades con las que se trabaja, `CatalogBanksComponent`, embebido abajo sin su propio `&lt;app-section&gt;`/anchor). | 7 internas; ext.: @angular/common, @angular/core, rxjs | 2 | Baja (2 consumidores) |
| [catalog-banks.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts) | .ts | Componente Angular | Feature (pantalla) | Fragmento "Bancos con los que trabajamos" — catálogo informativo con flip 3D (imagen + nombre al frente, descripción + información adicional al reverso). | 7 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [bank-card.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-card-bank-card-component-ts) | .ts | Componente Angular | Feature (pantalla) | Card individual del catálogo de Bancos — frente (imagen + nombre) y reverso (nombre + descripción + información adicional) unidos por el mismo flip 3D CSS puro ya usado en Teléfonos/Librería/Variedades (`preserve-3d`/`rotateY`, sin librería de animación). | 4 internas; ext.: @angular/core | 4 | Media (4 consumidores) |
| [bank-carousel.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-carousel-bank-carousel-component-ts) | .ts | Componente Angular | Feature (pantalla) | Carrusel de "Bancos con los que trabajamos" — solo información pública de cada entidad (imagen, nombre, descripción). | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [catalog-preview.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-preview-catalog-preview-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CatalogPreviewComponent` (sin comentario de documentación en el código). | 4 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [contact.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-contact-contact-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `ContactComponent` (sin comentario de documentación en el código). | 4 internas; ext.: @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [credibility.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-credibility-credibility-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CredibilityComponent` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [hero-showcase.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-showcase-component-ts) | .ts | Componente Angular | Feature (pantalla) | Purely decorative "product dashboard" visual for the hero: a flow card plus a couple of floating stat chips. | 1 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [hero.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `HeroComponent` (sin comentario de documentación en el código). | 6 internas; ext.: @angular/core, @angular/router, rxjs | 2 | Baja (2 consumidores) |
| [library-catalog.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts) | .ts | Componente Angular | Feature (pantalla) | Sección "LIBRERÍA" de la landing pública — catálogo puramente informativo (sin "Lo quiero", sin WhatsApp, sin crédito). | 8 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [news-card.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-card-news-card-component-ts) | .ts | Componente Angular | Feature (pantalla) | Card de noticia — imagen, título, fecha, extracto truncado. | 4 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [news-carousel.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-carousel-news-carousel-component-ts) | .ts | Componente Angular | Feature (pantalla) | Carrusel de Noticias — sin flip, cada card abre el modal de detalle. | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [news-detail-modal.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-detail-modal-news-detail-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Detalle completo de una noticia — imagen completa, título, fecha, descripción completa. | 3 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [news.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts) | .ts | Componente Angular | Feature (pantalla) | Sección "NOTICIAS" de la landing pública — contenido editorial, NO un producto (sin precio, sin WhatsApp, sin Krediya). | 7 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [phone-card.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-card-phone-card-component-ts) | .ts | Componente Angular | Feature (pantalla) | Card individual del carousel — frente (imagen, marca/modelo/precio, badges) y reverso (specs completas + CTAs) unidos por un flip 3D CSS puro (`preserve-3d`/`rotateY`, sin librería de animación — ninguna está instalada en el proyecto). | 5 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [phone-carousel.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-carousel-phone-carousel-component-ts) | .ts | Componente Angular | Feature (pantalla) | Carrusel de Teléfonos — delega toda la mecánica (scroll full-width, swipe/arrastre, flechas, puntos, autoplay con pausa) en el `LandingCarouselComponent` compartido por toda la landing; aquí solo se decide qué card se pinta por slide y se reenvían sus eventos. | 3 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [phone-interest-modal.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-interest-modal-phone-interest-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Modal "¿Te interesa este teléfono?" — representa una SOLICITUD DE INTERÉS, nunca una venta. | 6 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [phones.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts) | .ts | Componente Angular | Feature (pantalla) | Sección "TELÉFONOS" de la landing pública — catálogo visual premium (carousel 3D) de los teléfonos publicados desde el panel. | 9 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [services.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-services-services-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `ServicesComponent` (sin comentario de documentación en el código). | 6 internas; ext.: @angular/common, @angular/core, @angular/router | 2 | Baja (2 consumidores) |
| [catalog-product-card.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-card-catalog-product-card-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Card compartida por "Librería" y "Variedades y Accesorios" — mismo flip 3D CSS que `PhoneCardComponent` (frente/reverso, `preserve-3d`/`rotateY`), pero sin badges de crédito y con `showInterestButton` controlando si aparece "Lo quiero" — la única diferencia de negocio entre ambas secciones vive en este único `@Input`, nunca en una copia duplicada del componente. | 5 internas; ext.: @angular/core | 2 | Baja (2 consumidores) |
| [catalog-product-carousel.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-carousel-catalog-product-carousel-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Carrusel compartido por "Librería" y "Variedades y Accesorios" — la mecánica vive en `LandingCarouselComponent`; aquí solo se reenvían `showInterestButton`/`enhancedEffects` a cada `CatalogProductCardComponent` (la única diferencia real entre ambas secciones vive en esa card). | 3 internas; ext.: @angular/core | 4 | Media (4 consumidores) |
| [landing-carousel.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-shared-landing-carousel-landing-carousel-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Carrusel full-width compartido por TODA la landing (Teléfonos, Librería, Variedades, Bancos, Noticias) — reemplaza las cuatro copias casi idénticas del antiguo coverflow de una sola card. | 1 internas; ext.: @angular/common, @angular/core | 8 | Media (8 consumidores) |
| [section-landing-background.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts) | .ts | Componente Angular | Shared (UI reutilizable) | Une cada sección real de la landing con la capa de fondo administrable — una sola línea por sección (`&lt;app-section-landing-background sectionKey="telefonos" /&gt;`, primer hijo dentro de la sección) en vez de repetir la inyección/búsqueda en las 9 secciones. | 2 internas; ext.: @angular/core, rxjs | 18 | Alta (18 consumidores) |
| [product-interest-modal.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-components-product-interest-modal-product-interest-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Modal "¿Te interesa este producto?" — reutiliza exactamente el mismo mecanismo de WhatsApp que `PhoneInterestModalComponent`. | 6 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 2 | Baja (2 consumidores) |
| [varieties-catalog.component.ts](#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts) | .ts | Componente Angular | Feature (pantalla) | Sección "VARIEDADES Y ACCESORIOS" de la landing pública — catálogo con captura de interés ("Lo quiero" → WhatsApp, mismo mecanismo ya usado por Teléfonos). | 9 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [quick-access-dock.component.html](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `quick-access-dock.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [quick-access-dock.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [landing-page.component.html](../../../../comercial-jhoel-app/src/app/features/landing/landing-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `landing-page.component.ts`; usa 13 componentes hijos: `app-loading-screen`, `app-hero`, `app-credibility`, `app-services`, `app-phones`, `app-library-catalog`. | — | — | Media |
| [landing-page.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/landing-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [about.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/about/about.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `about.component.ts`; usa 4 componentes hijos: `app-section`, `app-section-landing-background`, `app-badge`, `app-icon`. | — | — | Media |
| [about.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/about/about.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-agents.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/bank-agents/bank-agents.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-agents.component.ts`; usa 7 componentes hijos: `app-section`, `app-section-landing-background`, `app-section-heading`, `app-icon`, `app-button`, `app-card`. | — | — | Media |
| [bank-agents.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/bank-agents/bank-agents.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-banks.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/catalog-banks.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-banks.component.ts`; usa 3 componentes hijos: `app-section-heading`, `app-bank-carousel`, `app-image-lightbox`. | — | — | Media |
| [catalog-banks.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/catalog-banks.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-card.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-card/bank-card.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-card.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [bank-card.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-card/bank-card.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [bank-carousel.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-carousel/bank-carousel.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `bank-carousel.component.ts`; usa 2 componentes hijos: `app-landing-carousel`, `app-bank-card`. | — | — | Media |
| [bank-carousel.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-carousel/bank-carousel.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-preview.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-preview/catalog-preview.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-preview.component.ts`; usa 5 componentes hijos: `app-section`, `app-section-heading`, `app-card`, `app-icon`, `app-button`. | — | — | Media |
| [catalog-preview.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-preview/catalog-preview.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [contact.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/contact/contact.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `contact.component.ts`; usa 5 componentes hijos: `app-section`, `app-section-landing-background`, `app-section-heading`, `app-icon`, `app-button`. | — | — | Media |
| [contact.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/contact/contact.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [credibility.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/credibility/credibility.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `credibility.component.ts`; usa 2 componentes hijos: `app-section`, `app-stat-card`. | — | — | Media |
| [credibility.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/credibility/credibility.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [hero-showcase.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/hero/hero-showcase.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `hero-showcase.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [hero-showcase.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/hero/hero-showcase.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [hero.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/hero/hero.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `hero.component.ts`; usa 6 componentes hijos: `app-section-landing-background`, `app-container`, `app-badge`, `app-button`, `app-icon`, `app-hero-showcase`. | — | — | Media |
| [hero.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/hero/hero.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [library-catalog.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/library-catalog/library-catalog.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `library-catalog.component.ts`; usa 5 componentes hijos: `app-section`, `app-section-landing-background`, `app-section-heading`, `app-catalog-product-carousel`, `app-image-lightbox`. | — | — | Media |
| [library-catalog.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/library-catalog/library-catalog.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [news-card.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-card/news-card.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-card.component.ts`; usa 2 componentes hijos: `app-icon`, `app-like-button`. | — | — | Media |
| [news-card.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-card/news-card.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [news-carousel.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-carousel/news-carousel.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-carousel.component.ts`; usa 2 componentes hijos: `app-landing-carousel`, `app-news-card`. | — | — | Media |
| [news-carousel.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-carousel/news-carousel.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [news-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-detail-modal/news-detail-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-detail-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [news-detail-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-detail-modal/news-detail-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [news.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/news.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news.component.ts`; usa 5 componentes hijos: `app-section`, `app-section-landing-background`, `app-section-heading`, `app-news-carousel`, `app-news-detail-modal`. | — | — | Media |
| [news.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/news.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phone-card.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-card/phone-card.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phone-card.component.ts`; usa 4 componentes hijos: `app-icon`, `app-badge`, `app-like-button`, `app-button`. | — | — | Media |
| [phone-card.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-card/phone-card.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phone-carousel.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-carousel/phone-carousel.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phone-carousel.component.ts`; usa 2 componentes hijos: `app-landing-carousel`, `app-phone-card`. | — | — | Media |
| [phone-carousel.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-carousel/phone-carousel.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phone-interest-modal.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phone-interest-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [phone-interest-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [phones.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/phones.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `phones.component.ts`; usa 6 componentes hijos: `app-section`, `app-section-landing-background`, `app-section-heading`, `app-phone-carousel`, `app-phone-interest-modal`, `app-image-lightbox`. | — | — | Media |
| [phones.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/phones.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [services.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/services/services.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `services.component.ts`; usa 4 componentes hijos: `app-section`, `app-section-landing-background`, `app-section-heading`, `app-icon`. | — | — | Media |
| [services.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/services/services.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-product-card.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `catalog-product-card.component.ts`; usa 3 componentes hijos: `app-icon`, `app-like-button`, `app-button`. | — | — | Media |
| [catalog-product-card.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [catalog-product-carousel.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-carousel/catalog-product-carousel.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `catalog-product-carousel.component.ts`; usa 2 componentes hijos: `app-landing-carousel`, `app-catalog-product-card`. | — | — | Media |
| [catalog-product-carousel.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-carousel/catalog-product-carousel.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [landing-carousel.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.html) | .html | Plantilla HTML | Shared (UI reutilizable) | Plantilla de `landing-carousel.component.ts`; usa 1 componentes hijos: `app-icon`. | — | — | Media |
| [landing-carousel.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.scss) | .scss | Estilos SCSS | Shared (UI reutilizable) | Estilos del componente del mismo nombre. | — | — | Baja |
| [product-interest-modal.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/components/product-interest-modal/product-interest-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `product-interest-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [product-interest-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/components/product-interest-modal/product-interest-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [varieties-catalog.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/varieties-catalog.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `varieties-catalog.component.ts`; usa 6 componentes hijos: `app-section`, `app-section-landing-background`, `app-section-heading`, `app-catalog-product-carousel`, `app-product-interest-modal`, `app-image-lightbox`. | — | — | Media |
| [varieties-catalog.component.scss](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/varieties-catalog.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-landing-components-quick-access-dock-quick-access-dock-component-ts"></a>

### quick-access-dock.component.ts

- **Ruta:** [quick-access-dock.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.ts) (`comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.ts`, 302 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Dock flotante de acceso rápido de la landing — SOLO navegación: no duplica catálogos, cards, WhatsApp ni Notificaciones.
- **Depende de (archivos del proyecto):** [contact.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-contact-service-ts), [landing-quick-access.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-landing-quick-access-store-ts), [notifications-modal.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notifications-modal-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [quick-access-dock.component.html](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="activate(item)"`, `(error)="onThumbnailError(item.id)"`

**Interfaces, tipos y enums:**

- `interface DockItem` (L22): sin documentación — miembros: `id`, `label`, `ariaLabel`, `icon`, `sectionId`, `thumbnailUrl`, `href`, `action`, `tone`, `dividerBefore`

#### Clase `QuickAccessDockComponent` (L65–301)

- **Decoradores:** `@Component({ selector: 'app-quick-access-dock', standalone: true, imports: [NgTemplateOutlet, IconComponent], templateUrl: './quick-access-dock.component.html', `
- **Propósito:** Dock flotante de acceso rápido de la landing — SOLO navegación: no duplica catálogos, cards, WhatsApp ni Notificaciones. - Catálogos: miniaturas publicadas por las propias secciones en `LandingQuickAccessStore` (las mismas URLs que ya muestran sus cards; cero peticiones propias). Un catálogo sin contenido no existe en la página, así que tampoco aparece aquí. - Notificaciones: abre el mismo `NotificationsModalComponent` del Navbar vía `NotificationsModalService`; la lógica de Web Push no se toca. - WhatsApp: el mismo enlace `wa.me` de `ContactService` que usan Hero y Contacto; si la empresa no configuró WhatsApp, el acceso lleva a la sección Contacto. Estado activo con `IntersectionObserver` (una línea a media pantalla), nunca con cálculos por evento de scroll.
- **Servicios inyectados con `inject()`:** `store = inject(LandingQuickAccessStore)`, `notificationsModal = inject(NotificationsModalService)`, `contactService = inject(ContactService)`, `zone = inject(NgZone)`, `destroyRef = inject(DestroyRef)`
- **Datos / estado que administra:** `ready = input(true)`, `whatsappHref = signal<string \| null>(null)`, `brokenThumbnails = signal<ReadonlySet<string>>(new Set())`, `activeSection = signal<string \| null>(null)`, `nearFooter = signal(false)`, `heroInView = signal(true)`, `scrollingDown = signal(false)`, `isDesktop = signal(this.matches(DOCK_DESKTOP_QUERY))`, `hidden = computed(() => !this.isDesktop() && (this.heroInVi`, `items = computed<DockItem[]>(() => { const catalogs = this`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `activate` | método public | 192–201 | `item: DockItem` | `void` |
| `onThumbnailError` | método public | 203–205 | `id: string` | `void` |
| `setUpObservers` | método private | 209–244 | — | `void` |
| `observeSections` | método private | 246–258 | — | `void` |
| `onSectionEntries` | método private | 260–273 | `entries: IntersectionObserverEntry[]` | `void` |
| `onScroll` | propiedad-función private | 276–289 | — | `void` |
| `setOutside` | método private | 292–296 | `target: { (): T; set(value: T): void }`, `value: T` | `void` |
| `matches` | método private | 298–300 | `query: string` | `boolean` |

##### `QuickAccessDockComponent.activate`

- **Firma:** `activate(item: DockItem): void` — [quick-access-dock.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.ts#L192) (L192–201)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.notificationsModal.open`, `this.matches`, `document.getElementById(item.sectionId)?.scrollIntoView`, `document.getElementById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `quick-access-dock.component.html` (plantilla)

##### `QuickAccessDockComponent.onThumbnailError`

- **Firma:** `onThumbnailError(id: string): void` — [quick-access-dock.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.ts#L203) (L203–205)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.brokenThumbnails.update`, `new Set(current).add`, `new Set`
- **Efectos secundarios:** Actualiza estado (signals): `this.brokenThumbnails.update`
- **Consumidores:** `quick-access-dock.component.html` (plantilla)

##### `QuickAccessDockComponent.setUpObservers`

- **Firma:** `setUpObservers(): void` — [quick-access-dock.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.ts#L209) (L209–244)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.heroInView.set`, `this.zone.runOutsideAngular`, `new IntersectionObserver`, `this.onSectionEntries`, `this.observeSections`, `document.getElementById`, `this.setOutside`, `document.querySelector`, `window.addEventListener`, `window.matchMedia`, `desktopQuery.addEventListener`
- **Efectos secundarios:** Actualiza estado (signals): `this.heroInView.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuickAccessDockComponent.observeSections`

- **Firma:** `observeSections(): void` — [quick-access-dock.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.ts#L246) (L246–258)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `CATALOG_ITEMS.map`, `document.getElementById`, `this.observedSections.has`, `this.observedSections.add`, `this.sectionObserver.observe`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `QuickAccessDockComponent.onSectionEntries`

- **Firma:** `onSectionEntries(entries: IntersectionObserverEntry[]): void` — [quick-access-dock.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.ts#L260) (L260–273)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.intersecting.add`, `this.intersecting.delete`, `[...order].reverse().find`, `[...order].reverse`, `this.intersecting.has`, `this.setOutside`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `QuickAccessDockComponent.onScroll`

- **Firma:** `onScroll(): void` — [quick-access-dock.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.ts#L276) (L276–289)
- **Propósito / descripción:** Solo móvil/tablet: esconder al bajar, mostrar al subir (menos contenido tapado). Un listener pasivo, agrupado en rAF.
- **Dependencias (llamadas en su cuerpo):** `this.isDesktop`, `requestAnimationFrame`, `Math.abs`, `this.setOutside`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `QuickAccessDockComponent.setOutside`

- **Firma:** `setOutside(target: { (): T; set(value: T): void }, value: T): void` — [quick-access-dock.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.ts#L292) (L292–296)
- **Propósito / descripción:** Escribe un signal desde fuera de la zona, entrando a ella solo si el valor cambia.
- **Dependencias (llamadas en su cuerpo):** `target`, `this.zone.run`, `target.set`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `QuickAccessDockComponent.matches`

- **Firma:** `matches(query: string): boolean` — [quick-access-dock.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/components/quick-access-dock/quick-access-dock.component.ts#L298) (L298–300)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `window.matchMedia`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts"></a>

### landing-page.component.ts

- **Ruta:** [landing-page.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/landing-page.component.ts) (`comercial-jhoel-app/src/app/features/landing/landing-page.component.ts`, 74 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Componente Angular: declara `LandingPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [site-visits.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-site-visits-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [hero.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts), [credibility.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-credibility-credibility-component-ts), [services.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-services-services-component-ts), [phones.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts), [library-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts), [varieties-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts), [news.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts), [catalog-preview.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-preview-catalog-preview-component-ts), [bank-agents.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts), [about.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-about-about-component-ts), [contact.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-contact-contact-component-ts), [quick-access-dock.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-components-quick-access-dock-quick-access-dock-component-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [landing-page.component.html](../../../../comercial-jhoel-app/src/app/features/landing/landing-page.component.html) · **Usa componentes:** [loading-screen.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-loading-screen-loading-screen-component-ts), [hero.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts), [credibility.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-credibility-credibility-component-ts), [services.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-services-services-component-ts), [phones.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts), [library-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts), [varieties-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts), [news.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts), [catalog-preview.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-preview-catalog-preview-component-ts), [bank-agents.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts), [about.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-about-about-component-ts), [contact.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-contact-contact-component-ts), [quick-access-dock.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-components-quick-access-dock-quick-access-dock-component-ts)
- **Eventos enlazados en la plantilla:** `(finished)="introDone.set(true)"`

#### Clase `LandingPageComponent` (L19–73)

- **Decoradores:** `@Component({ selector: 'app-landing-page', standalone: true, imports: [ LoadingScreenComponent, HeroComponent, CredibilityComponent, ServicesComponent, PhonesCom`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `siteVisitsService = inject(SiteVisitsService)`
- **Datos / estado que administra:** `introDone = signal(false)`
<a id="f-comercial-jhoel-app-src-app-features-landing-sections-about-about-component-ts"></a>

### about.component.ts

- **Ruta:** [about.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/about/about.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/about/about.component.ts`, 41 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Componente Angular: declara `AboutComponent`, `Value` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [reveal-on-scroll.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts), [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [about.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/about/about.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)

**Interfaces, tipos y enums:**

- `interface Value` (L8): sin documentación — miembros: `icon`, `title`, `text`

#### Clase `AboutComponent` (L14–40)

- **Decoradores:** `@Component({ selector: 'app-about', standalone: true, imports: [SectionComponent, BadgeComponent, IconComponent, RevealOnScrollDirective, ParallaxLayerDirective,`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts"></a>

### bank-agents.component.ts

- **Ruta:** [bank-agents.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/bank-agents/bank-agents.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/bank-agents/bank-agents.component.ts`, 68 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** "Agentes Bancarios" — sección pública única que fusiona lo que antes eran dos secciones separadas: esta misma (la oferta de servicio propio como agente bancario) y "Bancos" (el catálogo de entidades con las que se trabaja, `CatalogBanksComponent`, embebido abajo sin su propio `&lt;app-section&gt;`/anchor).
- **Depende de (archivos del proyecto):** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts), [bank-agent.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-agent-service-ts), [contact.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-contact-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [reveal-on-scroll.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts), [catalog-banks.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [bank-agents.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/bank-agents/bank-agents.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [section-heading.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [catalog-banks.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts)

#### Clase `BankAgentsComponent` (L30–67)

- **Decoradores:** `@Component({ selector: 'app-bank-agents', standalone: true, imports: [ AsyncPipe, SectionComponent, SectionHeadingComponent, CardComponent, ButtonComponent, Icon`
- **Propósito:** "Agentes Bancarios" — sección pública única que fusiona lo que antes eran dos secciones separadas: esta misma (la oferta de servicio propio como agente bancario) y "Bancos" (el catálogo de entidades con las que se trabaja, `CatalogBanksComponent`, embebido abajo sin su propio `&lt;app-section&gt;`/anchor). Un solo destino de navegación (`agentes-bancarios`) para ambos conceptos — nunca dos anchors para contenido relacionado. Nada financiero interno (saldos, cuentas, cuadre) aparece aquí ni apareció nunca: ambas fuentes ya eran exclusivamente de cara al público antes de la fusión.
- **Servicios inyectados con `inject()`:** `bankAgentService = inject(BankAgentService)`, `contactService = inject(ContactService)`
- **Datos / estado que administra:** `whatsappHref = signal<string \| null>(null)`
<a id="f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts"></a>

### catalog-banks.component.ts

- **Ruta:** [catalog-banks.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/catalog-banks.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/catalog-banks.component.ts`, 71 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Fragmento "Bancos con los que trabajamos" — catálogo informativo con flip 3D (imagen + nombre al frente, descripción + información adicional al reverso).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-catalog-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-catalog-bank-service-ts), [reveal-on-scroll.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts), [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [bank-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-carousel-bank-carousel-component-ts), [landing-quick-access.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-landing-quick-access-store-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [bank-agents.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts), [bank-agents.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts) (plantilla)
- **Plantilla:** [catalog-banks.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/catalog-banks.component.html) · **Usa componentes:** [section-heading.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts), [bank-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-carousel-bank-carousel-component-ts), [image-lightbox.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-image-lightbox-image-lightbox-component-ts)
- **Eventos enlazados en la plantilla:** `(imageZoom)="onImageZoom($event)"`, `(closed)="closeImageLightbox()"`

#### Clase `CatalogBanksComponent` (L25–70)

- **Decoradores:** `@Component({ selector: 'app-catalog-banks', standalone: true, imports: [SectionHeadingComponent, RevealOnScrollDirective, ParallaxLayerDirective, BankCarouselCom`
- **Propósito:** Fragmento "Bancos con los que trabajamos" — catálogo informativo con flip 3D (imagen + nombre al frente, descripción + información adicional al reverso). Completamente independiente del módulo financiero de Bancos (Agentes Bancarios/Cuadre). Deliberadamente SIN su propio `&lt;app-section&gt;`/anchor: se fusionó dentro de `BankAgentsComponent` (una sola sección pública "Agentes Bancarios", un solo destino de navegación) — este componente ahora solo aporta el fragmento visual (glow + encabezado + carousel + lightbox), montado como hijo de la sección que si lo envuelve. Si no hay bancos publicados, no renderiza nada.
- **Servicios inyectados con `inject()`:** `publicCatalogBankService = inject(PublicCatalogBankService)`, `quickAccess = inject(LandingQuickAccessStore)`
- **Datos / estado que administra:** `banks = signal<PublicCatalogBank[]>([])`, `loading = signal(true)`, `zoomedImageUrl = signal<string \| null>(null)`, `zoomedImageAlt = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onImageZoom` | método public | 62–65 | `event: { url: string; alt: string }` | `void` |
| `closeImageLightbox` | método public | 67–69 | — | `void` |

##### `CatalogBanksComponent.onImageZoom`

- **Firma:** `onImageZoom(event: { url: string; alt: string }): void` — [catalog-banks.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/catalog-banks.component.ts#L62) (L62–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.zoomedImageUrl.set`, `this.zoomedImageAlt.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.zoomedImageUrl.set`, `this.zoomedImageAlt.set`
- **Consumidores:** `catalog-banks.component.html` (plantilla)

##### `CatalogBanksComponent.closeImageLightbox`

- **Firma:** `closeImageLightbox(): void` — [catalog-banks.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/catalog-banks.component.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.zoomedImageUrl.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.zoomedImageUrl.set`
- **Consumidores:** `catalog-banks.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-card-bank-card-component-ts"></a>

### bank-card.component.ts

- **Ruta:** [bank-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-card/bank-card.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-card/bank-card.component.ts`, 59 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Card individual del catálogo de Bancos — frente (imagen + nombre) y reverso (nombre + descripción + información adicional) unidos por el mismo flip 3D CSS puro ya usado en Teléfonos/Librería/Variedades (`preserve-3d`/`rotateY`, sin librería de animación).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-catalog-bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-catalog-bank-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [tilt-on-mouse.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-tilt-on-mouse-directive-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [bank-preview-modal.component.ts](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-preview-modal-bank-preview-modal-component-ts), [bank-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-carousel-bank-carousel-component-ts), [bank-preview-modal.component.ts (plantilla)](dashboard-catalog-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-catalog-banks-components-bank-preview-modal-bank-preview-modal-component-ts) (plantilla), [bank-carousel.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-carousel-bank-carousel-component-ts) (plantilla)
- **Plantilla:** [bank-card.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-card/bank-card.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="toggleFlip()"`, `(click)="onImageClick($event)"`, `(click)="toggleFlip(); $event.stopPropagation()"`

#### Clase `BankCardComponent` (L17–58)

- **Decoradores:** `@Component({ selector: 'app-bank-card', standalone: true, imports: [IconComponent, TiltOnMouseDirective], templateUrl: './bank-card.component.html', styleUrl: '.`
- **Propósito:** Card individual del catálogo de Bancos — frente (imagen + nombre) y reverso (nombre + descripción + información adicional) unidos por el mismo flip 3D CSS puro ya usado en Teléfonos/Librería/Variedades (`preserve-3d`/`rotateY`, sin librería de animación). Clonado de `CatalogProductCardComponent` — mismo patrón, forma de datos distinta (sin precio/categoría/"Lo quiero": este catálogo es puramente informativo). Sin Like (no fue pedido, fuera de alcance).
- **Servicios inyectados con `inject()`:** `publicCatalogBankService = inject(PublicCatalogBankService)`
- **Datos / estado que administra:** `@Input bank: PublicCatalogBank`, `@Input forceFlipped = null`, `@Output imageZoom = new EventEmitter<{ url: string; alt: string }>()`, `flippedByClick = signal(false)`, `imageUrl = computed(() => this.bank.hasImage ? this.publicCat`, `flipped = computed(() => this.forceFlipped ?? this.flippedBy`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toggleFlip` | método public | 43–48 | — | `void` |
| `onImageClick` | método public | 50–57 | `event: Event` | `void` |

##### `BankCardComponent.toggleFlip`

- **Firma:** `toggleFlip(): void` — [bank-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-card/bank-card.component.ts#L43) (L43–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.flippedByClick.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.flippedByClick.update`
- **Consumidores:** `bank-card.component.html` (plantilla)

##### `BankCardComponent.onImageClick`

- **Firma:** `onImageClick(event: Event): void` — [bank-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-card/bank-card.component.ts#L50) (L50–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `event.stopPropagation`, `this.imageUrl`, `this.imageZoom.emit`
- **Efectos secundarios:** Emite eventos: `this.imageZoom.emit`
- **Consumidores:** `bank-card.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-carousel-bank-carousel-component-ts"></a>

### bank-carousel.component.ts

- **Ruta:** [bank-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-carousel/bank-carousel.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-carousel/bank-carousel.component.ts`, 31 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Carrusel de "Bancos con los que trabajamos" — solo información pública de cada entidad (imagen, nombre, descripción).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [landing-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-landing-carousel-landing-carousel-component-ts), [bank-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-card-bank-card-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [catalog-banks.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts), [catalog-banks.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts) (plantilla)
- **Plantilla:** [bank-carousel.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-carousel/bank-carousel.component.html) · **Usa componentes:** [landing-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-landing-carousel-landing-carousel-component-ts), [bank-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-card-bank-card-component-ts)
- **Eventos enlazados en la plantilla:** `(imageZoom)="onImageZoom($event)"`

#### Clase `BankCarouselComponent` (L12–30)

- **Decoradores:** `@Component({ selector: 'app-bank-carousel', standalone: true, imports: [LandingCarouselComponent, BankCardComponent], templateUrl: './bank-carousel.component.htm`
- **Propósito:** Carrusel de "Bancos con los que trabajamos" — solo información pública de cada entidad (imagen, nombre, descripción). La mecánica vive en `LandingCarouselComponent`.
- **Datos / estado que administra:** `@Input banks = []`, `@Output imageZoom = new EventEmitter<{ url: string; alt: string }>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `bankLabel` | propiedad-función public | 25–25 | `bank: PublicCatalogBank` | `string` |
| `onImageZoom` | método public | 27–29 | `event: { url: string; alt: string }` | `void` |

##### `BankCarouselComponent.bankLabel`

- **Firma:** `bankLabel(bank: PublicCatalogBank): string` — [bank-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-carousel/bank-carousel.component.ts#L25) (L25–25)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `BankCarouselComponent.onImageZoom`

- **Firma:** `onImageZoom(event: { url: string; alt: string }): void` — [bank-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-banks/components/bank-carousel/bank-carousel.component.ts#L27) (L27–29)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageZoom.emit`
- **Efectos secundarios:** Emite eventos: `this.imageZoom.emit`
- **Consumidores:** `bank-carousel.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-catalog-preview-catalog-preview-component-ts"></a>

### catalog-preview.component.ts

- **Ruta:** [catalog-preview.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-preview/catalog-preview.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/catalog-preview/catalog-preview.component.ts`, 36 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Componente Angular: declara `CatalogPreviewComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [reveal-on-scroll.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts), [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [catalog-preview.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/catalog-preview/catalog-preview.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [section-heading.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)

#### Clase `CatalogPreviewComponent` (L15–35)

- **Decoradores:** `@Component({ selector: 'app-catalog-preview', standalone: true, imports: [ AsyncPipe, SectionComponent, SectionHeadingComponent, CardComponent, ButtonComponent, `
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `catalogService = inject(CatalogService)`
<a id="f-comercial-jhoel-app-src-app-features-landing-sections-contact-contact-component-ts"></a>

### contact.component.ts

- **Ruta:** [contact.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/contact/contact.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/contact/contact.component.ts`, 86 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Componente Angular: declara `ContactComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [contact.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-contact-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [contact.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/contact/contact.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [section-heading.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="isSubmitted.set(false)"`, `(ngSubmit)="submit()"`

#### Clase `ContactComponent` (L10–85)

- **Decoradores:** `@Component({ selector: 'app-contact', standalone: true, imports: [ ReactiveFormsModule, SectionComponent, SectionHeadingComponent, ButtonComponent, IconComponent`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `contactService = inject(ContactService)`
- **Datos / estado que administra:** `loadingInfo = signal(true)`, `infoLoadError = signal(false)`, `businessName = signal<string \| null>(null)`, `businessHours = signal<string \| null>(null)`, `channels = signal<ContactChannel[]>([])`, `socialLinks = signal<SocialLink[]>([])`, `isSubmitting = signal(false)`, `isSubmitted = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchContactInfo` | método public | 53–70 | — | `void` |
| `submit` | método public | 72–84 | — | `void` |

##### `ContactComponent.fetchContactInfo`

- **Firma:** `fetchContactInfo(): void` — [contact.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/contact/contact.component.ts#L53) (L53–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadingInfo.set`, `this.infoLoadError.set`, `this.contactService.getContactInfo().pipe(catchError(() => of(null))).subscribe`, `this.contactService.getContactInfo().pipe`, `this.contactService.getContactInfo`, `catchError`, `of`, `this.businessName.set`, `this.businessHours.set`, `this.channels.set`, `this.socialLinks.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loadingInfo.set`, `this.infoLoadError.set`, `this.businessName.set`, `this.businessHours.set`, `this.channels.set`, `this.socialLinks.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ContactComponent.submit`

- **Firma:** `submit(): void` — [contact.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/contact/contact.component.ts#L72) (L72–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.form.markAllAsTouched`, `this.isSubmitting.set`, `this.contactService.submit(this.form.getRawValue()).subscribe`, `this.contactService.submit`, `this.form.getRawValue`, `this.isSubmitted.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`, `this.isSubmitted.set`
- **Consumidores:** `contact.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-credibility-credibility-component-ts"></a>

### credibility.component.ts

- **Ruta:** [credibility.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/credibility/credibility.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/credibility/credibility.component.ts`, 20 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Componente Angular: declara `CredibilityComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [stats.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-stats-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [reveal-on-scroll.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [credibility.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/credibility/credibility.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [stat-card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-stat-card-stat-card-component-ts)

#### Clase `CredibilityComponent` (L8–19)

- **Decoradores:** `@Component({ selector: 'app-credibility', standalone: true, imports: [AsyncPipe, SectionComponent, StatCardComponent, RevealOnScrollDirective], templateUrl: './c`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `statsService = inject(StatsService)`
<a id="f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-showcase-component-ts"></a>

### hero-showcase.component.ts

- **Ruta:** [hero-showcase.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/hero/hero-showcase.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/hero/hero-showcase.component.ts`, 46 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Purely decorative "product dashboard" visual for the hero: a flow card plus a couple of floating stat chips.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [hero.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts), [hero.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts) (plantilla)
- **Plantilla:** [hero-showcase.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/hero/hero-showcase.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)

**Interfaces, tipos y enums:**

- `interface FlowStep` (L5): sin documentación — miembros: `icon`, `label`

#### Clase `HeroShowcaseComponent` (L22–45)

- **Decoradores:** `@Component({ selector: 'app-hero-showcase', standalone: true, imports: [IconComponent], templateUrl: './hero-showcase.component.html', styleUrl: './hero-showcase`
- **Propósito:** Purely decorative "product dashboard" visual for the hero: a flow card plus a couple of floating stat chips. Built with CSS/SVG only so it stays lightweight and easy to restyle without touching markup. Escena 3D: panel, chips y "tiles" de catálogo viven a distinta profundidad (`translateZ`) dentro de un escenario con `preserve-3d` que rota muy levemente según `--hx`/`--hy` — variables que escribe el listener de mouse que `HeroComponent` ya tenía (este componente no agrega ninguno propio). Sin mouse (touch/reduced-motion) queda en una pose fija en perspectiva.
<a id="f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts"></a>

### hero.component.ts

- **Ruta:** [hero.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/hero/hero.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/hero/hero.component.ts`, 107 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Componente Angular: declara `HeroComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts), [contact.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-contact-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [hero-showcase.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-showcase-component-ts), [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [hero.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/hero/hero.component.html) · **Usa componentes:** [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [container.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-container-container-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [hero-showcase.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-showcase-component-ts)
- **Eventos enlazados en la plantilla:** `(mousemove)="onHeroMouseMove($event)"`, `(mouseleave)="onHeroMouseLeave($event)"`

#### Clase `HeroComponent` (L12–106)

- **Decoradores:** `@Component({ selector: 'app-hero', standalone: true, imports: [ RouterLink, ContainerComponent, BadgeComponent, ButtonComponent, IconComponent, HeroShowcaseCompo`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `contactService = inject(ContactService)`
- **Datos / estado que administra:** `ready = input(true)`, `whatsappHref = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onHeroMouseMove` | método public | 51–66 | `event: MouseEvent` | `void` |
| `onHeroMouseLeave` | método public | 69–80 | `event: MouseEvent` | `void` |

##### `HeroComponent.onHeroMouseMove`

- **Firma:** `onHeroMouseMove(event: MouseEvent): void` — [hero.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/hero/hero.component.ts#L51) (L51–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `requestAnimationFrame`, `target.getBoundingClientRect`, `target.style.setProperty`, `(px * 100).toFixed`, `(py * 100).toFixed`, `(px - 0.5).toFixed`, `(py - 0.5).toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `hero.component.html` (plantilla)

##### `HeroComponent.onHeroMouseLeave`

- **Firma:** `onHeroMouseLeave(event: MouseEvent): void` — [hero.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/hero/hero.component.ts#L69) (L69–80)
- **Propósito / descripción:** Al salir del Hero, la escena vuelve suavemente a su pose de reposo.
- **Dependencias (llamadas en su cuerpo):** `cancelAnimationFrame`, `target.style.setProperty`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `hero.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts"></a>

### library-catalog.component.ts

- **Ruta:** [library-catalog.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/library-catalog/library-catalog.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/library-catalog/library-catalog.component.ts`, 73 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Sección "LIBRERÍA" de la landing pública — catálogo puramente informativo (sin "Lo quiero", sin WhatsApp, sin crédito).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-product-catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-product-catalog-service-ts), [reveal-on-scroll.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts), [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [catalog-product-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-carousel-catalog-product-carousel-component-ts), [landing-quick-access.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-landing-quick-access-store-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [library-catalog.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/library-catalog/library-catalog.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [section-heading.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts), [catalog-product-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-carousel-catalog-product-carousel-component-ts), [image-lightbox.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-image-lightbox-image-lightbox-component-ts)
- **Eventos enlazados en la plantilla:** `(imageZoom)="onImageZoom($event)"`, `(closed)="closeImageLightbox()"`

#### Clase `LibraryCatalogComponent` (L19–72)

- **Decoradores:** `@Component({ selector: 'app-library-catalog', standalone: true, imports: [ SectionComponent, SectionHeadingComponent, RevealOnScrollDirective, ParallaxLayerDirec`
- **Propósito:** Sección "LIBRERÍA" de la landing pública — catálogo puramente informativo (sin "Lo quiero", sin WhatsApp, sin crédito). Si no hay productos publicados, la sección simplemente no se renderiza — nunca datos de ejemplo hardcodeados.
- **Servicios inyectados con `inject()`:** `publicProductCatalogService = inject(PublicProductCatalogService)`, `quickAccess = inject(LandingQuickAccessStore)`
- **Datos / estado que administra:** `products = signal<PublicCatalogProduct[]>([])`, `loading = signal(true)`, `zoomedImageUrl = signal<string \| null>(null)`, `zoomedImageAlt = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onImageZoom` | método public | 64–67 | `event: { url: string; alt: string }` | `void` |
| `closeImageLightbox` | método public | 69–71 | — | `void` |

##### `LibraryCatalogComponent.onImageZoom`

- **Firma:** `onImageZoom(event: { url: string; alt: string }): void` — [library-catalog.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/library-catalog/library-catalog.component.ts#L64) (L64–67)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.zoomedImageUrl.set`, `this.zoomedImageAlt.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.zoomedImageUrl.set`, `this.zoomedImageAlt.set`
- **Consumidores:** `library-catalog.component.html` (plantilla)

##### `LibraryCatalogComponent.closeImageLightbox`

- **Firma:** `closeImageLightbox(): void` — [library-catalog.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/library-catalog/library-catalog.component.ts#L69) (L69–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.zoomedImageUrl.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.zoomedImageUrl.set`
- **Consumidores:** `library-catalog.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-card-news-card-component-ts"></a>

### news-card.component.ts

- **Ruta:** [news-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-card/news-card.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/news/components/news-card/news-card.component.ts`, 93 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Card de noticia — imagen, título, fecha, extracto truncado.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-news.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-news-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [tilt-on-mouse.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-tilt-on-mouse-directive-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [news-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-carousel-news-carousel-component-ts), [news-carousel.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-carousel-news-carousel-component-ts) (plantilla)
- **Plantilla:** [news-card.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-card/news-card.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [like-button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-like-button-like-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="open()"`, `(keydown)="onKeydownOpen($event)"`, `(toggled)="toggleLike()"`

#### Clase `NewsCardComponent` (L19–92)

- **Decoradores:** `@Component({ selector: 'app-news-card', standalone: true, imports: [DatePipe, IconComponent, LikeButtonComponent, TiltOnMouseDirective], templateUrl: './news-car`
- **Herencia / contratos:** implements OnInit
- **Propósito:** Card de noticia — imagen, título, fecha, extracto truncado. Sin flip (es contenido de lectura, no un producto). Click abre el detalle completo. El contenedor raíz es un `&lt;div role="button"&gt;` (no un `&lt;button&gt;`) para poder alojar el botón de "me gusta" real sin anidar un botón dentro de otro elemento con rol de botón — mismo criterio ya documentado en `PhoneCardComponent`.
- **Servicios inyectados con `inject()`:** `publicNewsService = inject(PublicNewsService)`
- **Datos / estado que administra:** `@Input article: PublicNewsArticle`, `@Output opened = new EventEmitter<void>()`, `liked = signal(false)`, `likesCount = signal(0)`, `likeBusy = signal(false)`, `imageUrl = computed(() => (this.article.hasImage ? this.publi`, `excerpt = computed(() => { const description = this.article.`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnInit` | método public | 48–52 | — | `void` |
| `open` | método public | 54–56 | — | `void` |
| `onKeydownOpen` | método public | 58–63 | `event: KeyboardEvent` | `void` |
| `toggleLike` | método public | 66–91 | — | `void` |

##### `NewsCardComponent.ngOnInit`

- **Firma:** `ngOnInit(): void` — [news-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-card/news-card.component.ts#L48) (L48–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.liked.set`, `this.likesCount.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.liked.set`, `this.likesCount.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsCardComponent.open`

- **Firma:** `open(): void` — [news-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-card/news-card.component.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.opened.emit`
- **Efectos secundarios:** Emite eventos: `this.opened.emit`
- **Consumidores:** `news-card.component.html` (plantilla), (mismo archivo)

##### `NewsCardComponent.onKeydownOpen`

- **Firma:** `onKeydownOpen(event: KeyboardEvent): void` — [news-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-card/news-card.component.ts#L58) (L58–63)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `event.preventDefault`, `this.open`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `news-card.component.html` (plantilla)

##### `NewsCardComponent.toggleLike`

- **Firma:** `toggleLike(): void` — [news-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-card/news-card.component.ts#L66) (L66–91)
- **Propósito / descripción:** Optimista: refleja el nuevo estado de inmediato y lo revierte si la llamada falla. El backend es siempre la fuente de verdad final del contador.
- **Dependencias (llamadas en su cuerpo):** `this.likeBusy`, `this.liked`, `this.liked.set`, `this.likesCount.update`, `Math.max`, `this.likeBusy.set`, `this.publicNewsService.likeArticle`, `this.publicNewsService.unlikeArticle`, `request$.subscribe`, `this.likesCount.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.liked.set`, `this.likesCount.update`, `this.likeBusy.set`, `this.likesCount.set`
- **Consumidores:** `news-card.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-carousel-news-carousel-component-ts"></a>

### news-carousel.component.ts

- **Ruta:** [news-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-carousel/news-carousel.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/news/components/news-carousel/news-carousel.component.ts`, 30 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Carrusel de Noticias — sin flip, cada card abre el modal de detalle.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [landing-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-landing-carousel-landing-carousel-component-ts), [news-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-card-news-card-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [news.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts), [news.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts) (plantilla)
- **Plantilla:** [news-carousel.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-carousel/news-carousel.component.html) · **Usa componentes:** [landing-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-landing-carousel-landing-carousel-component-ts), [news-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-card-news-card-component-ts)
- **Eventos enlazados en la plantilla:** `(opened)="onOpen(article)"`

#### Clase `NewsCarouselComponent` (L11–29)

- **Decoradores:** `@Component({ selector: 'app-news-carousel', standalone: true, imports: [LandingCarouselComponent, NewsCardComponent], templateUrl: './news-carousel.component.htm`
- **Propósito:** Carrusel de Noticias — sin flip, cada card abre el modal de detalle. La mecánica vive en `LandingCarouselComponent`.
- **Datos / estado que administra:** `@Input articles = []`, `@Output opened = new EventEmitter<PublicNewsArticle>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `articleLabel` | propiedad-función public | 24–24 | `article: PublicNewsArticle` | `string` |
| `onOpen` | método public | 26–28 | `article: PublicNewsArticle` | `void` |

##### `NewsCarouselComponent.articleLabel`

- **Firma:** `articleLabel(article: PublicNewsArticle): string` — [news-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-carousel/news-carousel.component.ts#L24) (L24–24)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsCarouselComponent.onOpen`

- **Firma:** `onOpen(article: PublicNewsArticle): void` — [news-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-carousel/news-carousel.component.ts#L26) (L26–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.opened.emit`
- **Efectos secundarios:** Emite eventos: `this.opened.emit`
- **Consumidores:** `news-carousel.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-detail-modal-news-detail-modal-component-ts"></a>

### news-detail-modal.component.ts

- **Ruta:** [news-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-detail-modal/news-detail-modal.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/news/components/news-detail-modal/news-detail-modal.component.ts`, 36 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Detalle completo de una noticia — imagen completa, título, fecha, descripción completa.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-news.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-news-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [news.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts), [news.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts) (plantilla)
- **Plantilla:** [news-detail-modal.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-detail-modal/news-detail-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`

#### Clase `NewsDetailModalComponent` (L9–35)

- **Decoradores:** `@Component({ selector: 'app-news-detail-modal', standalone: true, imports: [DatePipe, ButtonComponent, IconComponent], templateUrl: './news-detail-modal.componen`
- **Propósito:** Detalle completo de una noticia — imagen completa, título, fecha, descripción completa. Sin flip, sin WhatsApp, sin Krediya.
- **Servicios inyectados con `inject()`:** `publicNewsService = inject(PublicNewsService)`
- **Datos / estado que administra:** `@Input article = null`, `@Output closed = new EventEmitter<void>()`, `imageUrl = computed(() => this.article?.hasImage ? this.publi`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 28–30 | — | `boolean` |
| `close` | método public | 32–34 | — | `void` |

##### `NewsDetailModalComponent.open`

- **Firma:** `open(): boolean` — [news-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-detail-modal/news-detail-modal.component.ts#L28) (L28–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsDetailModalComponent.close`

- **Firma:** `close(): void` — [news-detail-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/components/news-detail-modal/news-detail-modal.component.ts#L32) (L32–34)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `news-detail-modal.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts"></a>

### news.component.ts

- **Ruta:** [news.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/news.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/news/news.component.ts`, 62 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Sección "NOTICIAS" de la landing pública — contenido editorial, NO un producto (sin precio, sin WhatsApp, sin Krediya).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-news.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-news-service-ts), [reveal-on-scroll.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [news-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-carousel-news-carousel-component-ts), [news-detail-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-detail-modal-news-detail-modal-component-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [news.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/news.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [section-heading.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts), [news-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-carousel-news-carousel-component-ts), [news-detail-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-detail-modal-news-detail-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(opened)="openDetail($event)"`, `(closed)="closeDetail()"`

#### Clase `NewsComponent` (L19–61)

- **Decoradores:** `@Component({ selector: 'app-news', standalone: true, imports: [ SectionComponent, SectionHeadingComponent, RevealOnScrollDirective, NewsCarouselComponent, NewsDe`
- **Propósito:** Sección "NOTICIAS" de la landing pública — contenido editorial, NO un producto (sin precio, sin WhatsApp, sin Krediya). Carousel 3D centrado (misma mecánica que Teléfonos: autoplay cada 5s, swipe, teclado); cada card abre un modal de detalle al hacer click. Si no hay noticias activas, la sección no se renderiza.
- **Servicios inyectados con `inject()`:** `publicNewsService = inject(PublicNewsService)`
- **Datos / estado que administra:** `articles = signal<PublicNewsArticle[]>([])`, `loading = signal(true)`, `selectedArticle = signal<PublicNewsArticle \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `openDetail` | método public | 54–56 | `article: PublicNewsArticle` | `void` |
| `closeDetail` | método public | 58–60 | — | `void` |

##### `NewsComponent.openDetail`

- **Firma:** `openDetail(article: PublicNewsArticle): void` — [news.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/news.component.ts#L54) (L54–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedArticle.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedArticle.set`
- **Consumidores:** `news.component.html` (plantilla)

##### `NewsComponent.closeDetail`

- **Firma:** `closeDetail(): void` — [news.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/news/news.component.ts#L58) (L58–60)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedArticle.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedArticle.set`
- **Consumidores:** `news.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-card-phone-card-component-ts"></a>

### phone-card.component.ts

- **Ruta:** [phone-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-card/phone-card.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-card/phone-card.component.ts`, 122 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Card individual del carousel — frente (imagen, marca/modelo/precio, badges) y reverso (specs completas + CTAs) unidos por un flip 3D CSS puro (`preserve-3d`/`rotateY`, sin librería de animación — ninguna está instalada en el proyecto).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-catalog-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [tilt-on-mouse.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-tilt-on-mouse-directive-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [phone-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-carousel-phone-carousel-component-ts), [phone-carousel.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-carousel-phone-carousel-component-ts) (plantilla)
- **Plantilla:** [phone-card.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-card/phone-card.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [like-button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-like-button-like-button-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="toggleFlip()"`, `(click)="onImageClick($event)"`, `(toggled)="toggleLike()"`, `(click)="toggleFlip(); $event.stopPropagation()"`, `(click)="requestInterest('INTERES_COMPRA')"`, `(click)="requestInterest('INTERES_CREDITO')"`

**Interfaces, tipos y enums:**

- `interface DisplaySpec` (L9): sin documentación — miembros: `label`, `value`

#### Clase `PhoneCardComponent` (L23–121)

- **Decoradores:** `@Component({ selector: 'app-phone-card', standalone: true, imports: [BadgeComponent, ButtonComponent, IconComponent, LikeButtonComponent, TiltOnMouseDirective], `
- **Herencia / contratos:** implements OnInit
- **Propósito:** Card individual del carousel — frente (imagen, marca/modelo/precio, badges) y reverso (specs completas + CTAs) unidos por un flip 3D CSS puro (`preserve-3d`/`rotateY`, sin librería de animación — ninguna está instalada en el proyecto). El click en la card entera es solo conveniencia de mouse; el botón "Ver especificaciones" es el control real accesible por teclado (evita anidar un botón dentro de otro elemento con rol de botón).
- **Servicios inyectados con `inject()`:** `publicCatalogService = inject(PublicCatalogService)`
- **Datos / estado que administra:** `@Input phone: PublicCatalogPhone`, `@Output interest = new EventEmitter<CatalogRequestType>()`, `@Output imageZoom = new EventEmitter<{ url: string; alt: string }>()`, `flipped = signal(false)`, `liked = signal(false)`, `likesCount = signal(0)`, `likeBusy = signal(false)`, `primaryImageUrl = computed(() => { const images = this.phone.images;`, `specs = computed<DisplaySpec[]>(() => { const phone = this`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnInit` | método public | 47–51 | — | `void` |
| `toggleFlip` | método public | 77–79 | — | `void` |
| `requestInterest` | método public | 81–83 | `type: CatalogRequestType` | `void` |
| `onImageClick` | método public | 85–92 | `event: Event` | `void` |
| `toggleLike` | método public | 95–120 | — | `void` |

##### `PhoneCardComponent.ngOnInit`

- **Firma:** `ngOnInit(): void` — [phone-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-card/phone-card.component.ts#L47) (L47–51)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.liked.set`, `this.likesCount.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.liked.set`, `this.likesCount.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneCardComponent.toggleFlip`

- **Firma:** `toggleFlip(): void` — [phone-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-card/phone-card.component.ts#L77) (L77–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.flipped.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.flipped.update`
- **Consumidores:** `phone-card.component.html` (plantilla)

##### `PhoneCardComponent.requestInterest`

- **Firma:** `requestInterest(type: CatalogRequestType): void` — [phone-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-card/phone-card.component.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.interest.emit`
- **Efectos secundarios:** Emite eventos: `this.interest.emit`
- **Consumidores:** `phone-card.component.html` (plantilla)

##### `PhoneCardComponent.onImageClick`

- **Firma:** `onImageClick(event: Event): void` — [phone-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-card/phone-card.component.ts#L85) (L85–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `event.stopPropagation`, `this.primaryImageUrl`, `this.imageZoom.emit`
- **Efectos secundarios:** Emite eventos: `this.imageZoom.emit`
- **Consumidores:** `phone-card.component.html` (plantilla)

##### `PhoneCardComponent.toggleLike`

- **Firma:** `toggleLike(): void` — [phone-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-card/phone-card.component.ts#L95) (L95–120)
- **Propósito / descripción:** Optimista: refleja el nuevo estado de inmediato y lo revierte si la llamada falla — un "like" nunca debe sentirse lento. El backend es siempre la fuente de verdad final del contador.
- **Dependencias (llamadas en su cuerpo):** `this.likeBusy`, `this.liked`, `this.liked.set`, `this.likesCount.update`, `Math.max`, `this.likeBusy.set`, `this.publicCatalogService.likePhone`, `this.publicCatalogService.unlikePhone`, `request$.subscribe`, `this.likesCount.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.liked.set`, `this.likesCount.update`, `this.likeBusy.set`, `this.likesCount.set`
- **Consumidores:** `phone-card.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-carousel-phone-carousel-component-ts"></a>

### phone-carousel.component.ts

- **Ruta:** [phone-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-carousel/phone-carousel.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-carousel/phone-carousel.component.ts`, 42 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Carrusel de Teléfonos — delega toda la mecánica (scroll full-width, swipe/arrastre, flechas, puntos, autoplay con pausa) en el `LandingCarouselComponent` compartido por toda la landing; aquí solo se decide qué card se pinta por slide y se reenvían sus eventos.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [landing-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-landing-carousel-landing-carousel-component-ts), [phone-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-card-phone-card-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [phones.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts), [phones.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts) (plantilla)
- **Plantilla:** [phone-carousel.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-carousel/phone-carousel.component.html) · **Usa componentes:** [landing-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-landing-carousel-landing-carousel-component-ts), [phone-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-card-phone-card-component-ts)
- **Eventos enlazados en la plantilla:** `(interest)="onInterest(phone, $event)"`, `(imageZoom)="onImageZoom($event)"`

**Interfaces, tipos y enums:**

- `interface PhoneInterestEvent` (L7): sin documentación — miembros: `phone`, `requestType`

#### Clase `PhoneCarouselComponent` (L18–41)

- **Decoradores:** `@Component({ selector: 'app-phone-carousel', standalone: true, imports: [LandingCarouselComponent, PhoneCardComponent], templateUrl: './phone-carousel.component.`
- **Propósito:** Carrusel de Teléfonos — delega toda la mecánica (scroll full-width, swipe/arrastre, flechas, puntos, autoplay con pausa) en el `LandingCarouselComponent` compartido por toda la landing; aquí solo se decide qué card se pinta por slide y se reenvían sus eventos.
- **Datos / estado que administra:** `@Input phones = []`, `@Output requestInterest = new EventEmitter<PhoneInterestEvent>()`, `@Output imageZoom = new EventEmitter<{ url: string; alt: string }>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `phoneLabel` | propiedad-función public | 32–32 | `phone: PublicCatalogPhone` | `string` |
| `onInterest` | método public | 34–36 | `phone: PublicCatalogPhone`, `requestType: CatalogRequestType` | `void` |
| `onImageZoom` | método public | 38–40 | `event: { url: string; alt: string }` | `void` |

##### `PhoneCarouselComponent.phoneLabel`

- **Firma:** `phoneLabel(phone: PublicCatalogPhone): string` — [phone-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-carousel/phone-carousel.component.ts#L32) (L32–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneCarouselComponent.onInterest`

- **Firma:** `onInterest(phone: PublicCatalogPhone, requestType: CatalogRequestType): void` — [phone-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-carousel/phone-carousel.component.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.requestInterest.emit`
- **Efectos secundarios:** Emite eventos: `this.requestInterest.emit`
- **Consumidores:** `phone-carousel.component.html` (plantilla)

##### `PhoneCarouselComponent.onImageZoom`

- **Firma:** `onImageZoom(event: { url: string; alt: string }): void` — [phone-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-carousel/phone-carousel.component.ts#L38) (L38–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageZoom.emit`
- **Efectos secundarios:** Emite eventos: `this.imageZoom.emit`
- **Consumidores:** `phone-carousel.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-interest-modal-phone-interest-modal-component-ts"></a>

### phone-interest-modal.component.ts

- **Ruta:** [phone-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.ts`, 159 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Modal "¿Te interesa este teléfono?" — representa una SOLICITUD DE INTERÉS, nunca una venta.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [contact.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-contact-service-ts), [public-catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-catalog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [phones.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts), [phones.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts) (plantilla)
- **Plantilla:** [phone-interest-modal.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`, `(ngSubmit)="submit()"`

#### Clase `PhoneInterestModalComponent` (L37–158)

- **Decoradores:** `@Component({ selector: 'app-phone-interest-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './phone-intere`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Modal "¿Te interesa este teléfono?" — representa una SOLICITUD DE INTERÉS, nunca una venta. Nombre + teléfono son los únicos datos pedidos (mínimo necesario). Tras guardar correctamente, arma un enlace de WhatsApp con un mensaje que solo expresa interés — nunca cuotas, tasas, plazos, ni indicación de aprobación (ver `CreateCatalogRequestUseCase` en el backend: la elegibilidad de crédito siempre se recalcula ahí, nunca se asume aquí).
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `publicCatalogService = inject(PublicCatalogService)`, `contactService = inject(ContactService)`
- **Datos / estado que administra:** `@Input phone = null`, `@Input requestType = null`, `@Output closed = new EventEmitter<void>()`, `isSubmitting = signal(false)`, `isSubmitted = signal(false)`, `errorMessage = signal<string \| null>(null)`, `whatsappHref = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 68–70 | — | `boolean` |
| `isCreditRequest` | getter public | 72–74 | — | `boolean` |
| `ngOnChanges` | método public | 85–97 | `changes: SimpleChanges` | `void` |
| `submit` | método public | 99–132 | — | `void` |
| `buildWhatsappHref` | método private | 134–150 | `phone: PublicCatalogPhone`, `requestType: CatalogRequestType`, `customerName: string` | `string \| null` |
| `close` | método public | 152–157 | — | `void` |

##### `PhoneInterestModalComponent.open`

- **Firma:** `open(): boolean` — [phone-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.ts#L68) (L68–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneInterestModalComponent.isCreditRequest`

- **Firma:** `isCreditRequest(): boolean` — [phone-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.ts#L72) (L72–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneInterestModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [phone-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.ts#L85) (L85–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting.set`, `this.isSubmitted.set`, `this.errorMessage.set`, `this.whatsappHref.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`, `this.isSubmitted.set`, `this.errorMessage.set`, `this.whatsappHref.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PhoneInterestModalComponent.submit`

- **Firma:** `submit(): void` — [phone-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.ts#L99) (L99–132)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.form.markAllAsTouched`, `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.getRawValue`, `raw.customerName.trim`, `raw.customerPhone.trim`, `this.publicCatalogService.createRequest`, `this.isSubmitted.set`, `this.whatsappHref.set`, `this.buildWhatsappHref`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`, `this.isSubmitted.set`, `this.whatsappHref.set`
- **Consumidores:** `phone-interest-modal.component.html` (plantilla)

##### `PhoneInterestModalComponent.buildWhatsappHref`

- **Firma:** `buildWhatsappHref(phone: PublicCatalogPhone, requestType: CatalogRequestType, customerName: string): string \| null` — [phone-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.ts#L134) (L134–150)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `digitsOnly`, `formatCurrency`, `encodeURIComponent`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `PhoneInterestModalComponent.close`

- **Firma:** `close(): void` — [phone-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.ts#L152) (L152–157)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `phone-interest-modal.component.html` (plantilla)

#### Función `digitsOnly` (L24–26)

- **Tipo:** función local del archivo
- **Firma:** `digitsOnly(value: string): string` — [phone-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/components/phone-interest-modal/phone-interest-modal.component.ts#L24)
- **Propósito / descripción:** Mismo criterio de `digitsOnly` que `ContactService` — un enlace `wa.me` necesita un string numérico limpio.
- **Dependencias:** `value.replace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts"></a>

### phones.component.ts

- **Ruta:** [phones.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/phones.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/phones/phones.component.ts`, 90 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Sección "TELÉFONOS" de la landing pública — catálogo visual premium (carousel 3D) de los teléfonos publicados desde el panel.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-catalog-service-ts), [reveal-on-scroll.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts), [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [phone-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-carousel-phone-carousel-component-ts), [phone-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-interest-modal-phone-interest-modal-component-ts), [landing-quick-access.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-landing-quick-access-store-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [phones.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/phones.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [section-heading.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts), [phone-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-carousel-phone-carousel-component-ts), [phone-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-interest-modal-phone-interest-modal-component-ts), [image-lightbox.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-image-lightbox-image-lightbox-component-ts)
- **Eventos enlazados en la plantilla:** `(requestInterest)="onRequestInterest($event)"`, `(imageZoom)="onImageZoom($event)"`, `(closed)="closeInterestModal()"`, `(closed)="closeImageLightbox()"`

#### Clase `PhonesComponent` (L21–89)

- **Decoradores:** `@Component({ selector: 'app-phones', standalone: true, imports: [ SectionComponent, SectionHeadingComponent, RevealOnScrollDirective, ParallaxLayerDirective, Sec`
- **Propósito:** Sección "TELÉFONOS" de la landing pública — catálogo visual premium (carousel 3D) de los teléfonos publicados desde el panel. Si el catálogo está vacío (sin teléfonos publicados), la sección simplemente no se renderiza — nunca se muestra un carousel vacío ni datos de ejemplo hardcodeados.
- **Servicios inyectados con `inject()`:** `publicCatalogService = inject(PublicCatalogService)`, `quickAccess = inject(LandingQuickAccessStore)`
- **Datos / estado que administra:** `phones = signal<PublicCatalogPhone[]>([])`, `loading = signal(true)`, `selectedPhone = signal<PublicCatalogPhone \| null>(null)`, `selectedRequestType = signal<CatalogRequestType \| null>(null)`, `zoomedImageUrl = signal<string \| null>(null)`, `zoomedImageAlt = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onRequestInterest` | método public | 71–74 | `event: PhoneInterestEvent` | `void` |
| `closeInterestModal` | método public | 76–79 | — | `void` |
| `onImageZoom` | método public | 81–84 | `event: { url: string; alt: string }` | `void` |
| `closeImageLightbox` | método public | 86–88 | — | `void` |

##### `PhonesComponent.onRequestInterest`

- **Firma:** `onRequestInterest(event: PhoneInterestEvent): void` — [phones.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/phones.component.ts#L71) (L71–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedPhone.set`, `this.selectedRequestType.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedPhone.set`, `this.selectedRequestType.set`
- **Consumidores:** `phones.component.html` (plantilla)

##### `PhonesComponent.closeInterestModal`

- **Firma:** `closeInterestModal(): void` — [phones.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/phones.component.ts#L76) (L76–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedPhone.set`, `this.selectedRequestType.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedPhone.set`, `this.selectedRequestType.set`
- **Consumidores:** `phones.component.html` (plantilla)

##### `PhonesComponent.onImageZoom`

- **Firma:** `onImageZoom(event: { url: string; alt: string }): void` — [phones.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/phones.component.ts#L81) (L81–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.zoomedImageUrl.set`, `this.zoomedImageAlt.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.zoomedImageUrl.set`, `this.zoomedImageAlt.set`
- **Consumidores:** `phones.component.html` (plantilla)

##### `PhonesComponent.closeImageLightbox`

- **Firma:** `closeImageLightbox(): void` — [phones.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/phones/phones.component.ts#L86) (L86–88)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.zoomedImageUrl.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.zoomedImageUrl.set`
- **Consumidores:** `phones.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-services-services-component-ts"></a>

### services.component.ts

- **Ruta:** [services.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/services/services.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/services/services.component.ts`, 34 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Componente Angular: declara `ServicesComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [offers.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-offers-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [reveal-on-scroll.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts), [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts), [tilt-on-mouse.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-tilt-on-mouse-directive-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [services.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/services/services.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [section-heading.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)

#### Clase `ServicesComponent` (L12–33)

- **Decoradores:** `@Component({ selector: 'app-services', standalone: true, imports: [ AsyncPipe, RouterLink, SectionComponent, SectionHeadingComponent, IconComponent, RevealOnScro`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `offersService = inject(OffersService)`
<a id="f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-card-catalog-product-card-component-ts"></a>

### catalog-product-card.component.ts

- **Ruta:** [catalog-product-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.ts`, 104 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Card compartida por "Librería" y "Variedades y Accesorios" — mismo flip 3D CSS que `PhoneCardComponent` (frente/reverso, `preserve-3d`/`rotateY`), pero sin badges de crédito y con `showInterestButton` controlando si aparece "Lo quiero" — la única diferencia de negocio entre ambas secciones vive en este único `@Input`, nunca en una copia duplicada del componente.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-product-catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-product-catalog-service-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [tilt-on-mouse.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-tilt-on-mouse-directive-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [catalog-product-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-carousel-catalog-product-carousel-component-ts), [catalog-product-carousel.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-carousel-catalog-product-carousel-component-ts) (plantilla)
- **Plantilla:** [catalog-product-card.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [like-button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-like-button-like-button-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="toggleFlip()"`, `(click)="onImageClick($event)"`, `(toggled)="toggleLike()"`, `(click)="toggleFlip(); $event.stopPropagation()"`, `(click)="requestInterest()"`

#### Clase `CatalogProductCardComponent` (L17–103)

- **Decoradores:** `@Component({ selector: 'app-catalog-product-card', standalone: true, imports: [ButtonComponent, IconComponent, LikeButtonComponent, TiltOnMouseDirective], templa`
- **Herencia / contratos:** implements OnInit
- **Propósito:** Card compartida por "Librería" y "Variedades y Accesorios" — mismo flip 3D CSS que `PhoneCardComponent` (frente/reverso, `preserve-3d`/`rotateY`), pero sin badges de crédito y con `showInterestButton` controlando si aparece "Lo quiero" — la única diferencia de negocio entre ambas secciones vive en este único `@Input`, nunca en una copia duplicada del componente.
- **Servicios inyectados con `inject()`:** `publicProductCatalogService = inject(PublicProductCatalogService)`
- **Datos / estado que administra:** `@Input product: PublicCatalogProduct`, `@Input showInterestButton = false`, `@Input enhancedEffects = false`, `@Output interest = new EventEmitter<void>()`, `@Output imageZoom = new EventEmitter<{ url: string; alt: string }>()`, `flipped = signal(false)`, `liked = signal(false)`, `likesCount = signal(0)`, `likeBusy = signal(false)`, `imageUrl = computed(() => this.product.hasImage ? this.public`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngOnInit` | método public | 53–57 | — | `void` |
| `toggleFlip` | método public | 59–61 | — | `void` |
| `requestInterest` | método public | 63–65 | — | `void` |
| `onImageClick` | método public | 67–74 | `event: Event` | `void` |
| `toggleLike` | método public | 77–102 | — | `void` |

##### `CatalogProductCardComponent.ngOnInit`

- **Firma:** `ngOnInit(): void` — [catalog-product-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.ts#L53) (L53–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.liked.set`, `this.likesCount.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.liked.set`, `this.likesCount.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductCardComponent.toggleFlip`

- **Firma:** `toggleFlip(): void` — [catalog-product-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.flipped.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.flipped.update`
- **Consumidores:** `catalog-product-card.component.html` (plantilla)

##### `CatalogProductCardComponent.requestInterest`

- **Firma:** `requestInterest(): void` — [catalog-product-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.interest.emit`
- **Efectos secundarios:** Emite eventos: `this.interest.emit`
- **Consumidores:** `catalog-product-card.component.html` (plantilla)

##### `CatalogProductCardComponent.onImageClick`

- **Firma:** `onImageClick(event: Event): void` — [catalog-product-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.ts#L67) (L67–74)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `event.stopPropagation`, `this.imageUrl`, `this.imageZoom.emit`
- **Efectos secundarios:** Emite eventos: `this.imageZoom.emit`
- **Consumidores:** `catalog-product-card.component.html` (plantilla)

##### `CatalogProductCardComponent.toggleLike`

- **Firma:** `toggleLike(): void` — [catalog-product-card.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.ts#L77) (L77–102)
- **Propósito / descripción:** Optimista: refleja el nuevo estado de inmediato y lo revierte si la llamada falla. El backend es siempre la fuente de verdad final del contador.
- **Dependencias (llamadas en su cuerpo):** `this.likeBusy`, `this.liked`, `this.liked.set`, `this.likesCount.update`, `Math.max`, `this.likeBusy.set`, `this.publicProductCatalogService.likeProduct`, `this.publicProductCatalogService.unlikeProduct`, `request$.subscribe`, `this.likesCount.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.liked.set`, `this.likesCount.update`, `this.likeBusy.set`, `this.likesCount.set`
- **Consumidores:** `catalog-product-card.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-carousel-catalog-product-carousel-component-ts"></a>

### catalog-product-carousel.component.ts

- **Ruta:** [catalog-product-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-carousel/catalog-product-carousel.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-carousel/catalog-product-carousel.component.ts`, 41 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Carrusel compartido por "Librería" y "Variedades y Accesorios" — la mecánica vive en `LandingCarouselComponent`; aquí solo se reenvían `showInterestButton`/`enhancedEffects` a cada `CatalogProductCardComponent` (la única diferencia real entre ambas secciones vive en esa card).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [landing-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-landing-carousel-landing-carousel-component-ts), [catalog-product-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-card-catalog-product-card-component-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [library-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts), [varieties-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts), [library-catalog.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts) (plantilla), [varieties-catalog.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts) (plantilla)
- **Plantilla:** [catalog-product-carousel.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-carousel/catalog-product-carousel.component.html) · **Usa componentes:** [landing-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-landing-carousel-landing-carousel-component-ts), [catalog-product-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-card-catalog-product-card-component-ts)
- **Eventos enlazados en la plantilla:** `(interest)="onInterest(product)"`, `(imageZoom)="onImageZoom($event)"`

#### Clase `CatalogProductCarouselComponent` (L13–40)

- **Decoradores:** `@Component({ selector: 'app-catalog-product-carousel', standalone: true, imports: [LandingCarouselComponent, CatalogProductCardComponent], templateUrl: './catalo`
- **Propósito:** Carrusel compartido por "Librería" y "Variedades y Accesorios" — la mecánica vive en `LandingCarouselComponent`; aquí solo se reenvían `showInterestButton`/`enhancedEffects` a cada `CatalogProductCardComponent` (la única diferencia real entre ambas secciones vive en esa card).
- **Datos / estado que administra:** `@Input products = []`, `@Input showInterestButton = false`, `@Input ariaLabel = 'Catálogo de productos'`, `@Input enhancedEffects = false`, `@Output interest = new EventEmitter<PublicCatalogProduct>()`, `@Output imageZoom = new EventEmitter<{ url: string; alt: string }>()`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `productLabel` | propiedad-función public | 31–31 | `product: PublicCatalogProduct` | `string` |
| `onInterest` | método public | 33–35 | `product: PublicCatalogProduct` | `void` |
| `onImageZoom` | método public | 37–39 | `event: { url: string; alt: string }` | `void` |

##### `CatalogProductCarouselComponent.productLabel`

- **Firma:** `productLabel(product: PublicCatalogProduct): string` — [catalog-product-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-carousel/catalog-product-carousel.component.ts#L31) (L31–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `CatalogProductCarouselComponent.onInterest`

- **Firma:** `onInterest(product: PublicCatalogProduct): void` — [catalog-product-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-carousel/catalog-product-carousel.component.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.interest.emit`
- **Efectos secundarios:** Emite eventos: `this.interest.emit`
- **Consumidores:** `catalog-product-carousel.component.html` (plantilla)

##### `CatalogProductCarouselComponent.onImageZoom`

- **Firma:** `onImageZoom(event: { url: string; alt: string }): void` — [catalog-product-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-carousel/catalog-product-carousel.component.ts#L37) (L37–39)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageZoom.emit`
- **Efectos secundarios:** Emite eventos: `this.imageZoom.emit`
- **Consumidores:** `catalog-product-carousel.component.html` (plantilla)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-shared-landing-carousel-landing-carousel-component-ts"></a>

### landing-carousel.component.ts

- **Ruta:** [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts`, 400 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Carrusel full-width compartido por TODA la landing (Teléfonos, Librería, Variedades, Bancos, Noticias) — reemplaza las cuatro copias casi idénticas del antiguo coverflow de una sola card.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [bank-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-carousel-bank-carousel-component-ts), [news-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-carousel-news-carousel-component-ts), [phone-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-carousel-phone-carousel-component-ts), [catalog-product-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-carousel-catalog-product-carousel-component-ts), [bank-carousel.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-carousel-bank-carousel-component-ts) (plantilla), [news-carousel.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-carousel-news-carousel-component-ts) (plantilla), [phone-carousel.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-carousel-phone-carousel-component-ts) (plantilla), [catalog-product-carousel.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-carousel-catalog-product-carousel-component-ts) (plantilla)
- **Plantilla:** [landing-carousel.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(mouseenter)="pauseAutoplay()"`, `(mouseleave)="resumeAutoplay()"`, `(focusin)="pauseAutoplay()"`, `(focusout)="resumeAutoplay()"`, `(click)="prev()"`, `(keydown)="onKeydown($event)"`, `(dragstart)="$event.preventDefault()"`, `(click)="next()"`, `(click)="goTo(position)"`

**Interfaces, tipos y enums:**

- `interface LandingCarouselSlideContext` (L22): Contexto que recibe la plantilla de cada slide: `let-item` + `let-i="index"`. — miembros: `$implicit`, `index`

#### Clase `LandingCarouselComponent` (L59–399)

- **Decoradores:** `@Component({ selector: 'app-landing-carousel', standalone: true, imports: [NgTemplateOutlet, IconComponent], templateUrl: './landing-carousel.component.html', st`
- **Herencia / contratos:** implements AfterViewInit, OnDestroy
- **Propósito:** Carrusel full-width compartido por TODA la landing (Teléfonos, Librería, Variedades, Bancos, Noticias) — reemplaza las cuatro copias casi idénticas del antiguo coverflow de una sola card. Cada wrapper de sección (`PhoneCarouselComponent`, `CatalogProductCarouselComponent`, `BankCarouselComponent`, `NewsCarouselComponent`) conserva su selector, inputs y outputs públicos, y solo le pasa a este componente sus items + una `&lt;ng-template&gt;` con la card — nunca una segunda implementación. Mecánica: - Scroll horizontal NATIVO con `scroll-snap` dentro del propio track: swipe táctil con inercia real, trackpad y rueda horizontal gratis, y el overflow queda confinado al track (la página nunca hace scroll horizontal). - Arrastre con mouse (solo `pointerType === 'mouse'`; touch ya lo hace el navegador) con umbral, y supresión del click que sigue a un drag — así arrastrar nunca voltea una flip card por 
- **Servicios inyectados con `inject()`:** `host = inject(ElementRef<HTMLElement>)`, `zone = inject(NgZone)`
- **Datos / estado que administra:** `items = input.required<T[]>()`, `ariaLabel = input('Carrusel')`, `itemLabel = input<(item: T) => string>(() => '')`, `itemNoun = input('elemento')`, `activePosition = signal(0)`, `positions = signal<number[]>([0])`, `atStart = signal(true)`, `atEnd = signal(true)`, `inView = signal(false)`, `dragging = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngAfterViewInit` | método public | 113–141 | — | `void` |
| `ngOnDestroy` | método public | 143–157 | — | `void` |
| `prev` | método public | 161–163 | — | `void` |
| `next` | método public | 165–167 | — | `void` |
| `goTo` | método public | 169–172 | `position: number` | `void` |
| `onKeydown` | método public | 174–187 | `event: KeyboardEvent` | `void` |
| `pauseAutoplay` | método public | 191–194 | — | `void` |
| `resumeAutoplay` | método public | 196–199 | — | `void` |
| `onVisibilityChange` | método private | 201–210 | `visible: boolean` | `void` |
| `startAutoplay` | método private | 212–219 | — | `void` |
| `stopAutoplay` | método private | 221–226 | — | `void` |
| `restartAutoplay` | método private | 228–231 | — | `void` |
| `advanceAutoplay` | método private | 234–241 | — | `void` |
| `onPointerDown` | propiedad-función private | 249–258 | `event: PointerEvent` | `void` |
| `onPointerMove` | propiedad-función private | 260–277 | `event: PointerEvent` | `void` |
| `onPointerUp` | propiedad-función private | 279–299 | `event: PointerEvent` | `void` |
| `onPointerCancel` | propiedad-función private | 301–308 | — | `void` |
| `onClickCapture` | propiedad-función private | 311–317 | `event: MouseEvent` | `void` |
| `resumeAfterInteraction` | método private | 320–324 | — | `void` |
| `pageSize` | método private | 329–334 | — | `number` |
| `scrollToPosition` | método private | 336–351 | `position: number`, `smooth: boolean` | `void` |
| `onScroll` | propiedad-función private | 353–353 | — | `void` |
| `scheduleMeasure` | método private | 355–365 | — | `void` |
| `measure` | método private | 367–398 | — | `void` |

##### `LandingCarouselComponent.ngAfterViewInit`

- **Firma:** `ngAfterViewInit(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L113) (L113–141)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.trackRef`, `this.zone.runOutsideAngular`, `track.addEventListener`, `new ResizeObserver`, `this.scheduleMeasure`, `this.resizeObserver.observe`, `new IntersectionObserver`, `this.zone.run`, `this.onVisibilityChange`, `this.intersectionObserver.observe`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingCarouselComponent.ngOnDestroy`

- **Firma:** `ngOnDestroy(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L143) (L143–157)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.trackRef`, `track.removeEventListener`, `this.resizeObserver?.disconnect`, `this.intersectionObserver?.disconnect`, `this.stopAutoplay`, `cancelAnimationFrame`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingCarouselComponent.prev`

- **Firma:** `prev(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L161) (L161–163)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.goTo`, `this.activePosition`, `this.pageSize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `landing-carousel.component.html` (plantilla), (mismo archivo)

##### `LandingCarouselComponent.next`

- **Firma:** `next(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L165) (L165–167)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.goTo`, `this.activePosition`, `this.pageSize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `landing-carousel.component.html` (plantilla), (mismo archivo)

##### `LandingCarouselComponent.goTo`

- **Firma:** `goTo(position: number): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L169) (L169–172)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scrollToPosition`, `this.restartAutoplay`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `landing-carousel.component.html` (plantilla), (mismo archivo)

##### `LandingCarouselComponent.onKeydown`

- **Firma:** `onKeydown(event: KeyboardEvent): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L174) (L174–187)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `event.preventDefault`, `this.prev`, `this.next`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `landing-carousel.component.html` (plantilla)

##### `LandingCarouselComponent.pauseAutoplay`

- **Firma:** `pauseAutoplay(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L191) (L191–194)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.stopAutoplay`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `landing-carousel.component.html` (plantilla), (mismo archivo)

##### `LandingCarouselComponent.resumeAutoplay`

- **Firma:** `resumeAutoplay(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L196) (L196–199)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.startAutoplay`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `landing-carousel.component.html` (plantilla), (mismo archivo)

##### `LandingCarouselComponent.onVisibilityChange`

- **Firma:** `onVisibilityChange(visible: boolean): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L201) (L201–210)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.inView`, `this.inView.set`, `this.startAutoplay`, `this.stopAutoplay`
- **Efectos secundarios:** Actualiza estado (signals): `this.inView.set`
- **Consumidores:** (mismo archivo)

##### `LandingCarouselComponent.startAutoplay`

- **Firma:** `startAutoplay(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L212) (L212–219)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.inView`, `this.zone.runOutsideAngular`, `setInterval`, `this.advanceAutoplay`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `LandingCarouselComponent.stopAutoplay`

- **Firma:** `stopAutoplay(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L221) (L221–226)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `clearInterval`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `LandingCarouselComponent.restartAutoplay`

- **Firma:** `restartAutoplay(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L228) (L228–231)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.stopAutoplay`, `this.startAutoplay`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `LandingCarouselComponent.advanceAutoplay`

- **Firma:** `advanceAutoplay(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L234) (L234–241)
- **Propósito / descripción:** Avanza una posición; al llegar al final vuelve al inicio — ciclo continuo.
- **Dependencias (llamadas en su cuerpo):** `this.positions`, `this.activePosition`, `this.scrollToPosition`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `LandingCarouselComponent.onPointerDown`

- **Firma:** `onPointerDown(event: PointerEvent): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L249) (L249–258)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.pauseAutoplay`, `this.trackRef`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingCarouselComponent.onPointerMove`

- **Firma:** `onPointerMove(event: PointerEvent): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L260) (L260–277)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.trackRef`, `Math.abs`, `this.zone.run`, `this.dragging.set`, `track.setPointerCapture`
- **Efectos secundarios:** Actualiza estado (signals): `this.dragging.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingCarouselComponent.onPointerUp`

- **Firma:** `onPointerUp(event: PointerEvent): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L279) (L279–299)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.resumeAfterInteraction`, `this.trackRef`, `track.hasPointerCapture`, `track.releasePointerCapture`, `this.zone.run`, `this.dragging.set`, `this.scrollToPosition`, `Math.round`
- **Efectos secundarios:** Actualiza estado (signals): `this.dragging.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingCarouselComponent.onPointerCancel`

- **Firma:** `onPointerCancel(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L301) (L301–308)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dragging`, `this.zone.run`, `this.dragging.set`, `this.resumeAfterInteraction`
- **Efectos secundarios:** Actualiza estado (signals): `this.dragging.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingCarouselComponent.onClickCapture`

- **Firma:** `onClickCapture(event: MouseEvent): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L311) (L311–317)
- **Propósito / descripción:** Fase de captura: un click que llega justo después de un drag nunca activa la card de abajo.
- **Dependencias (llamadas en su cuerpo):** `event.preventDefault`, `event.stopPropagation`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingCarouselComponent.resumeAfterInteraction`

- **Firma:** `resumeAfterInteraction(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L320) (L320–324)
- **Propósito / descripción:** En touch el `mouseleave` no existe — el autoplay se reanuda al soltar.
- **Dependencias (llamadas en su cuerpo):** `window.matchMedia`, `this.resumeAutoplay`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `LandingCarouselComponent.pageSize`

- **Firma:** `pageSize(): number` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L329) (L329–334)
- **Propósito / descripción:** Paso de las flechas: los slides completamente visibles menos uno (siempre queda uno de contexto), mínimo 1.
- **Dependencias (llamadas en su cuerpo):** `Math.max`, `Math.floor`, `this.trackRef`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `LandingCarouselComponent.scrollToPosition`

- **Firma:** `scrollToPosition(position: number, smooth: boolean): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L336) (L336–351)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.positions`, `Math.max`, `Math.min`, `this.trackRef`, `track.children.item`, `track.scrollTo`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `LandingCarouselComponent.onScroll`

- **Firma:** `onScroll(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L353) (L353–353)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.scheduleMeasure`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `LandingCarouselComponent.scheduleMeasure`

- **Firma:** `scheduleMeasure(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L355) (L355–365)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.zone.runOutsideAngular`, `requestAnimationFrame`, `this.measure`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `LandingCarouselComponent.measure`

- **Firma:** `measure(): void` — [landing-carousel.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/landing-carousel/landing-carousel.component.ts#L367) (L367–398)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.trackRef`, `slides.item`, `Math.max`, `Math.ceil`, `Math.min`, `Math.round`, `this.positions`, `this.activePosition`, `this.atStart`, `this.atEnd`, `this.zone.run`, `this.positions.set`, `Array.from`, `this.activePosition.set`, `this.atStart.set`, `this.atEnd.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.positions.set`, `this.activePosition.set`, `this.atStart.set`, `this.atEnd.set`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts"></a>

### section-landing-background.component.ts

- **Ruta:** [section-landing-background.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/section-landing-background/section-landing-background.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/shared/section-landing-background/section-landing-background.component.ts`, 56 líneas)
- **Tipo:** Componente Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Une cada sección real de la landing con la capa de fondo administrable — una sola línea por sección (`&lt;app-section-landing-background sectionKey="telefonos" /&gt;`, primer hijo dentro de la sección) en vez de repetir la inyección/búsqueda en las 9 secciones.
- **Depende de (archivos del proyecto):** [public-landing-background.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-landing-background-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `rxjs`
- **Consumidores:** [about.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-about-about-component-ts), [bank-agents.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts), [contact.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-contact-contact-component-ts), [hero.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts), [library-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts), [news.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts), [phones.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts), [services.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-services-services-component-ts), [varieties-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts), [about.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-about-about-component-ts) (plantilla), [bank-agents.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts) (plantilla), [contact.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-contact-contact-component-ts) (plantilla), [hero.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts) (plantilla), [library-catalog.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts) (plantilla), [news.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts) (plantilla) y 3 más

#### Clase `SectionLandingBackgroundComponent` (L18–55)

- **Decoradores:** `@Component({ selector: 'app-section-landing-background', standalone: true, imports: [LandingBackgroundLayerComponent], template: ' @if (background(); as bg) { <a`
- **Propósito:** Une cada sección real de la landing con la capa de fondo administrable — una sola línea por sección (`&lt;app-section-landing-background sectionKey="telefonos" /&gt;`, primer hijo dentro de la sección) en vez de repetir la inyección/búsqueda en las 9 secciones. `PublicLandingBackgroundService` cachea la petición (`shareReplay(1)`), así que montar esto en las 9 secciones nunca dispara 9 peticiones HTTP, solo una compartida. Renderiza `LandingBackgroundLayerComponent` — el mismo componente que la vista previa del admin — nunca una implementación aparte.
- **Servicios inyectados con `inject()`:** `service = inject(PublicLandingBackgroundService)`
- **Datos / estado que administra:** `sectionKey = input.required<string>()`, `background = computed( () => this.backgrounds().find((b) => b.s`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `imageUrl` | método public | 52–54 | `id: string` | `string` |

##### `SectionLandingBackgroundComponent.imageUrl`

- **Firma:** `imageUrl(id: string): string` — [section-landing-background.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/section-landing-background/section-landing-background.component.ts#L52) (L52–54)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.service.getImageUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-components-product-interest-modal-product-interest-modal-component-ts"></a>

### product-interest-modal.component.ts

- **Ruta:** [product-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/components/product-interest-modal/product-interest-modal.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/components/product-interest-modal/product-interest-modal.component.ts`, 143 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Modal "¿Te interesa este producto?" — reutiliza exactamente el mismo mecanismo de WhatsApp que `PhoneInterestModalComponent`.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [contact.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-contact-service-ts), [public-product-catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-product-catalog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [number-format.util.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-number-format-util-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [varieties-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts), [varieties-catalog.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts) (plantilla)
- **Plantilla:** [product-interest-modal.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/components/product-interest-modal/product-interest-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="close()"`, `(click)="$event.stopPropagation()"`, `(ngSubmit)="submit()"`

#### Clase `ProductInterestModalComponent` (L34–142)

- **Decoradores:** `@Component({ selector: 'app-product-interest-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './product-in`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Modal "¿Te interesa este producto?" — reutiliza exactamente el mismo mecanismo de WhatsApp que `PhoneInterestModalComponent`. Representa una SOLICITUD DE INTERÉS, nunca una venta. Deliberadamente sin nada de crédito/cuotas/Krediya — esa sección es exclusiva de Teléfonos.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `publicProductCatalogService = inject(PublicProductCatalogService)`, `contactService = inject(ContactService)`
- **Datos / estado que administra:** `@Input product = null`, `@Output closed = new EventEmitter<void>()`, `isSubmitting = signal(false)`, `isSubmitted = signal(false)`, `errorMessage = signal<string \| null>(null)`, `whatsappHref = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 64–66 | — | `boolean` |
| `ngOnChanges` | método public | 77–86 | `changes: SimpleChanges` | `void` |
| `submit` | método public | 88–119 | — | `void` |
| `buildWhatsappHref` | método private | 121–134 | `product: PublicCatalogProduct`, `customerName: string` | `string \| null` |
| `close` | método public | 136–141 | — | `void` |

##### `ProductInterestModalComponent.open`

- **Firma:** `open(): boolean` — [product-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/components/product-interest-modal/product-interest-modal.component.ts#L64) (L64–66)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductInterestModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [product-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/components/product-interest-modal/product-interest-modal.component.ts#L77) (L77–86)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting.set`, `this.isSubmitted.set`, `this.errorMessage.set`, `this.whatsappHref.set`, `this.form.reset`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSubmitting.set`, `this.isSubmitted.set`, `this.errorMessage.set`, `this.whatsappHref.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ProductInterestModalComponent.submit`

- **Firma:** `submit(): void` — [product-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/components/product-interest-modal/product-interest-modal.component.ts#L88) (L88–119)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.form.markAllAsTouched`, `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.getRawValue`, `raw.customerName.trim`, `raw.customerPhone.trim`, `this.publicProductCatalogService.createRequest`, `this.isSubmitted.set`, `this.whatsappHref.set`, `this.buildWhatsappHref`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`, `this.isSubmitted.set`, `this.whatsappHref.set`
- **Consumidores:** `product-interest-modal.component.html` (plantilla)

##### `ProductInterestModalComponent.buildWhatsappHref`

- **Firma:** `buildWhatsappHref(product: PublicCatalogProduct, customerName: string): string \| null` — [product-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/components/product-interest-modal/product-interest-modal.component.ts#L121) (L121–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `digitsOnly`, `formatCurrency`, `encodeURIComponent`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `ProductInterestModalComponent.close`

- **Firma:** `close(): void` — [product-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/components/product-interest-modal/product-interest-modal.component.ts#L136) (L136–141)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `product-interest-modal.component.html` (plantilla)

#### Función `digitsOnly` (L24–26)

- **Tipo:** función local del archivo
- **Firma:** `digitsOnly(value: string): string` — [product-interest-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/components/product-interest-modal/product-interest-modal.component.ts#L24)
- **Propósito / descripción:** Mismo criterio de `digitsOnly` que `ContactService`/`PhoneInterestModalComponent` — un enlace `wa.me` necesita un string numérico limpio.
- **Dependencias:** `value.replace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts"></a>

### varieties-catalog.component.ts

- **Ruta:** [varieties-catalog.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/varieties-catalog.component.ts) (`comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/varieties-catalog.component.ts`, 84 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `landing`
- **Responsabilidad:** Sección "VARIEDADES Y ACCESORIOS" de la landing pública — catálogo con captura de interés ("Lo quiero" → WhatsApp, mismo mecanismo ya usado por Teléfonos).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-product-catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-product-catalog-service-ts), [reveal-on-scroll.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts), [parallax-layer.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [catalog-product-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-carousel-catalog-product-carousel-component-ts), [product-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-components-product-interest-modal-product-interest-modal-component-ts), [landing-quick-access.store.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-landing-quick-access-store-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [landing-page.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts), [landing-page.component.ts (plantilla)](landing.md#f-comercial-jhoel-app-src-app-features-landing-landing-page-component-ts) (plantilla)
- **Plantilla:** [varieties-catalog.component.html](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/varieties-catalog.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [section-landing-background.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-section-landing-background-section-landing-background-component-ts), [section-heading.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-heading-section-heading-component-ts), [catalog-product-carousel.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-carousel-catalog-product-carousel-component-ts), [product-interest-modal.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-components-product-interest-modal-product-interest-modal-component-ts), [image-lightbox.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-image-lightbox-image-lightbox-component-ts)
- **Eventos enlazados en la plantilla:** `(interest)="onRequestInterest($event)"`, `(imageZoom)="onImageZoom($event)"`, `(closed)="closeInterestModal()"`, `(closed)="closeImageLightbox()"`

#### Clase `VarietiesCatalogComponent` (L20–83)

- **Decoradores:** `@Component({ selector: 'app-varieties-catalog', standalone: true, imports: [ SectionComponent, SectionHeadingComponent, RevealOnScrollDirective, ParallaxLayerDir`
- **Propósito:** Sección "VARIEDADES Y ACCESORIOS" de la landing pública — catálogo con captura de interés ("Lo quiero" → WhatsApp, mismo mecanismo ya usado por Teléfonos). Deliberadamente sin nada de Krediya/crédito — exclusivo de Teléfonos. Si no hay productos publicados, la sección no se renderiza.
- **Servicios inyectados con `inject()`:** `publicProductCatalogService = inject(PublicProductCatalogService)`, `quickAccess = inject(LandingQuickAccessStore)`
- **Datos / estado que administra:** `products = signal<PublicCatalogProduct[]>([])`, `loading = signal(true)`, `selectedProduct = signal<PublicCatalogProduct \| null>(null)`, `zoomedImageUrl = signal<string \| null>(null)`, `zoomedImageAlt = signal('')`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onRequestInterest` | método public | 67–69 | `product: PublicCatalogProduct` | `void` |
| `closeInterestModal` | método public | 71–73 | — | `void` |
| `onImageZoom` | método public | 75–78 | `event: { url: string; alt: string }` | `void` |
| `closeImageLightbox` | método public | 80–82 | — | `void` |

##### `VarietiesCatalogComponent.onRequestInterest`

- **Firma:** `onRequestInterest(product: PublicCatalogProduct): void` — [varieties-catalog.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/varieties-catalog.component.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedProduct.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedProduct.set`
- **Consumidores:** `varieties-catalog.component.html` (plantilla)

##### `VarietiesCatalogComponent.closeInterestModal`

- **Firma:** `closeInterestModal(): void` — [varieties-catalog.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/varieties-catalog.component.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedProduct.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedProduct.set`
- **Consumidores:** `varieties-catalog.component.html` (plantilla)

##### `VarietiesCatalogComponent.onImageZoom`

- **Firma:** `onImageZoom(event: { url: string; alt: string }): void` — [varieties-catalog.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/varieties-catalog.component.ts#L75) (L75–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.zoomedImageUrl.set`, `this.zoomedImageAlt.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.zoomedImageUrl.set`, `this.zoomedImageAlt.set`
- **Consumidores:** `varieties-catalog.component.html` (plantilla)

##### `VarietiesCatalogComponent.closeImageLightbox`

- **Firma:** `closeImageLightbox(): void` — [varieties-catalog.component.ts](../../../../comercial-jhoel-app/src/app/features/landing/sections/varieties-catalog/varieties-catalog.component.ts#L80) (L80–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.zoomedImageUrl.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.zoomedImageUrl.set`
- **Consumidores:** `varieties-catalog.component.html` (plantilla)

