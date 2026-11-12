# Frontend `catalog`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [catalog-page.component.ts](#f-comercial-jhoel-app-src-app-features-catalog-catalog-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `CatalogPageComponent` (sin comentario de documentación en el código). | 4 internas; ext.: @angular/common, @angular/core, rxjs | 1 | Baja (1 consumidores) |
| [catalog-page.component.html](../../../../comercial-jhoel-app/src/app/features/catalog/catalog-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `catalog-page.component.ts`; usa 5 componentes hijos: `app-section`, `app-badge`, `app-button`, `app-icon`, `app-card`. | — | — | Media |
| [catalog-page.component.scss](../../../../comercial-jhoel-app/src/app/features/catalog/catalog-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-catalog-catalog-page-component-ts"></a>

### catalog-page.component.ts

- **Ruta:** [catalog-page.component.ts](../../../../comercial-jhoel-app/src/app/features/catalog/catalog-page.component.ts) (`comercial-jhoel-app/src/app/features/catalog/catalog-page.component.ts`, 37 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `catalog`
- **Responsabilidad:** Componente Angular: declara `CatalogPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts), [catalog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-catalog-service-ts), [contact.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-contact-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [catalog-page.component.html](../../../../comercial-jhoel-app/src/app/features/catalog/catalog-page.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts)

#### Clase `CatalogPageComponent` (L10–36)

- **Decoradores:** `@Component({ selector: 'app-catalog-page', standalone: true, imports: [AsyncPipe, SectionComponent, CardComponent, BadgeComponent, ButtonComponent, IconComponent`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `catalogService = inject(CatalogService)`, `contactService = inject(ContactService)`
- **Datos / estado que administra:** `whatsappHref = signal<string \| null>(null)`
