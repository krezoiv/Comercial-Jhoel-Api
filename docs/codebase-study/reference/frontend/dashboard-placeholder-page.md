# Frontend `dashboard-placeholder-page`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [dashboard-placeholder-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-placeholder-page-dashboard-placeholder-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Generic "coming soon" page for a dashboard module. | 1 internas; ext.: @angular/core, @angular/router, rxjs | 1 | Baja (1 consumidores) |
| [dashboard-placeholder-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/placeholder-page/dashboard-placeholder-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `dashboard-placeholder-page.component.ts`; usa 2 componentes hijos: `app-icon`, `app-badge`. | — | — | Media |
| [dashboard-placeholder-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/placeholder-page/dashboard-placeholder-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-placeholder-page-dashboard-placeholder-page-component-ts"></a>

### dashboard-placeholder-page.component.ts

- **Ruta:** [dashboard-placeholder-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/placeholder-page/dashboard-placeholder-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/placeholder-page/dashboard-placeholder-page.component.ts`, 36 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-placeholder-page`
- **Responsabilidad:** Generic "coming soon" page for a dashboard module.
- **Depende de (archivos del proyecto):** [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [dashboard-placeholder-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/placeholder-page/dashboard-placeholder-page.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)

**Interfaces, tipos y enums:**

- `interface DashboardPlaceholderData` (L8): sin documentación — miembros: `title`, `icon`, `description`

#### Clase `DashboardPlaceholderPageComponent` (L20–35)

- **Decoradores:** `@Component({ selector: 'app-dashboard-placeholder-page', standalone: true, imports: [BadgeComponent, IconComponent], templateUrl: './dashboard-placeholder-page.c`
- **Propósito:** Generic "coming soon" page for a dashboard module. Route `data` supplies the copy (see app.routes.ts) so Sistema/Finanzas/Bancos/Librería don't each need their own near-identical component until there is real module-specific UI to build.
- **Servicios inyectados con `inject()`:** `route = inject(ActivatedRoute)`
