# Frontend `news-preferences`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [news-preferences-page.component.ts](#f-comercial-jhoel-app-src-app-features-news-preferences-news-preferences-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Autoservicio de preferencias (`/noticias/preferencias/:token`) — punto 19/20 del pedido: el cliente puede modificar sus categorías o cancelar por completo, sin usar su número de WhatsApp como autenticación (el `manageToken` de la URL es el mecanismo real). | 4 internas; ext.: @angular/common, @angular/core, @angular/router, rxjs | 1 | Baja (1 consumidores) |
| [news-preferences-page.component.html](../../../../comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-preferences-page.component.ts`; usa 3 componentes hijos: `app-section`, `app-button`, `app-icon`. | — | — | Media |
| [news-preferences-page.component.scss](../../../../comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-news-preferences-news-preferences-page-component-ts"></a>

### news-preferences-page.component.ts

- **Ruta:** [news-preferences-page.component.ts](../../../../comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.ts) (`comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.ts`, 141 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `news-preferences`
- **Responsabilidad:** Autoservicio de preferencias (`/noticias/preferencias/:token`) — punto 19/20 del pedido: el cliente puede modificar sus categorías o cancelar por completo, sin usar su número de WhatsApp como autenticación (el `manageToken` de la URL es el mecanismo real).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [public-news-subscription.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-public-news-subscription-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/router`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [news-preferences-page.component.html](../../../../comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.html) · **Usa componentes:** [section.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-section-section-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(change)="toggleType(type.id)"`, `(click)="save()"`, `(click)="cancelSubscription()"`

#### Clase `NewsPreferencesPageComponent` (L18–140)

- **Decoradores:** `@Component({ selector: 'app-news-preferences-page', standalone: true, imports: [RouterLink, SectionComponent, ButtonComponent, IconComponent], templateUrl: './ne`
- **Propósito:** Autoservicio de preferencias (`/noticias/preferencias/:token`) — punto 19/20 del pedido: el cliente puede modificar sus categorías o cancelar por completo, sin usar su número de WhatsApp como autenticación (el `manageToken` de la URL es el mecanismo real). No se elimina físicamente nada al cancelar.
- **Servicios inyectados con `inject()`:** `route = inject(ActivatedRoute)`, `publicNewsSubscriptionService = inject(PublicNewsSubscriptionService)`
- **Datos / estado que administra:** `loading = signal(true)`, `notFound = signal(false)`, `subscription = signal<Subscription \| null>(null)`, `availableTypes = signal<PublicNewsType[]>([])`, `selectedTypeIds = signal<Set<string>>(new Set())`, `isSaving = signal(false)`, `isCancelling = signal(false)`, `cancelled = signal(false)`, `errorMessage = signal<string \| null>(null)`, `successMessage = signal<string \| null>(null)`, `displayedSubscription = computed(() => (this.cancelled() ? null : this.sub`, `hasChanges = computed(() => { const sub = this.subscription(); `

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isChecked` | método public | 88–90 | `typeId: string` | `boolean` |
| `toggleType` | método public | 92–102 | `typeId: string` | `void` |
| `save` | método public | 104–124 | — | `void` |
| `cancelSubscription` | método public | 126–139 | — | `void` |

##### `NewsPreferencesPageComponent.isChecked`

- **Firma:** `isChecked(typeId: string): boolean` — [news-preferences-page.component.ts](../../../../comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.ts#L88) (L88–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedTypeIds().has`, `this.selectedTypeIds`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `news-preferences-page.component.html` (plantilla)

##### `NewsPreferencesPageComponent.toggleType`

- **Firma:** `toggleType(typeId: string): void` — [news-preferences-page.component.ts](../../../../comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.ts#L92) (L92–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedTypeIds.update`, `new Set`, `next.has`, `next.delete`, `next.add`
- **Efectos secundarios:** Actualiza estado (signals): `this.selectedTypeIds.update`
- **Consumidores:** `news-preferences-page.component.html` (plantilla)

##### `NewsPreferencesPageComponent.save`

- **Firma:** `save(): void` — [news-preferences-page.component.ts](../../../../comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.ts#L104) (L104–124)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.selectedTypeIds`, `this.errorMessage.set`, `this.successMessage.set`, `this.isSaving.set`, `this.publicNewsSubscriptionService.updatePreferences(this.token, typeIds).subscribe`, `this.publicNewsSubscriptionService.updatePreferences`, `this.subscription.set`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.successMessage.set`, `this.isSaving.set`, `this.subscription.set`
- **Consumidores:** `news-preferences-page.component.html` (plantilla)

##### `NewsPreferencesPageComponent.cancelSubscription`

- **Firma:** `cancelSubscription(): void` — [news-preferences-page.component.ts](../../../../comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.ts#L126) (L126–139)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isCancelling.set`, `this.publicNewsSubscriptionService.unsubscribe(this.token).subscribe`, `this.publicNewsSubscriptionService.unsubscribe`, `this.cancelled.set`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isCancelling.set`, `this.cancelled.set`
- **Consumidores:** `news-preferences-page.component.html` (plantilla)

