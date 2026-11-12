# Frontend `news-detail`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [news-detail-page.component.ts](#f-comercial-jhoel-app-src-app-features-news-detail-news-detail-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | URL pública real de una noticia (`/noticias/:slug`) — punto 17/18 del pedido. | 3 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 1 | Baja (1 consumidores) |
| [news-detail-page.component.html](../../../../comercial-jhoel-app/src/app/features/news-detail/news-detail-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-detail-page.component.ts`; usa 4 componentes hijos: `app-section`, `app-button`, `app-icon`, `app-badge`. | — | — | Media |
| [news-detail-page.component.scss](../../../../comercial-jhoel-app/src/app/features/news-detail/news-detail-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-news-detail-news-detail-page-component-ts"></a>

### news-detail-page.component.ts

- **Ruta:** [news-detail-page.component.ts](../../../../comercial-jhoel-app/src/app/features/news-detail/news-detail-page.component.ts) (`comercial-jhoel-app/src/app/features/news-detail/news-detail-page.component.ts`, 54 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `news-detail`
- **Responsabilidad:** URL pública real de una noticia (`/noticias/:slug`) — punto 17/18 del pedido.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-news.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-news-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [news-detail-page.component.html](../../../../comercial-jhoel-app/src/app/features/news-detail/news-detail-page.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)

#### Clase `NewsDetailPageComponent` (L18–53)

- **Decoradores:** `@Component({ selector: 'app-news-detail-page', standalone: true, imports: [DatePipe, RouterLink, SectionComponent, BadgeComponent, ButtonComponent, IconComponent`
- **Propósito:** URL pública real de una noticia (`/noticias/:slug`) — punto 17/18 del pedido. Antes de esto, una noticia solo existía como modal en memoria dentro de `/`, sin URL propia — este es el destino real del enlace que se manda en el mensaje de WhatsApp, funcional desde WhatsApp, navegador, móvil, desktop, refresh y acceso directo.
- **Servicios inyectados con `inject()`:** `route = inject(ActivatedRoute)`, `publicNewsService = inject(PublicNewsService)`
- **Datos / estado que administra:** `article = signal<PublicNewsArticle \| null>(null)`, `loading = signal(true)`, `notFound = signal(false)`, `imageUrl = computed(() => { const article = this.article(); r`
