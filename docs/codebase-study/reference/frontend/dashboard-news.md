# Frontend `dashboard-news`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [news-form-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-form-modal-news-form-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `NewsFormModalComponent`, `todayIsoDate` (sin comentario de documentación en el código). | 6 internas; ext.: @angular/common, @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [news-image-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-image-modal-news-image-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Gestor de la imagen principal de una noticia — subir/reemplazar/eliminar. | 6 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [news-table.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-table-news-table-component-ts) | .ts | Componente Angular | Feature (pantalla) | Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de Teléfonos/Librería/Variedades. | 2 internas; ext.: @angular/common, @angular/core | 2 | Baja (2 consumidores) |
| [news-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Sistema → Noticias" — contenido editorial de la landing pública, NO un producto: título, imagen, descripción, fecha de publicación, orden, activo/inactivo. | 9 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [news-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-form-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [news-form-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [news-image-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-image-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [news-image-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [news-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-table/news-table.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-table.component.ts`; usa 4 componentes hijos: `app-empty-state`, `app-button`, `app-icon`, `app-badge`. | — | — | Media |
| [news-table.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-table/news-table.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |
| [news-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `news-page.component.ts`; usa 6 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-news-table`, `app-news-form-modal`, `app-news-image-modal`. | — | — | Media |
| [news-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-form-modal-news-form-modal-component-ts"></a>

### news-form-modal.component.ts

- **Ruta:** [news-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.ts`, 142 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-news`
- **Responsabilidad:** Componente Angular: declara `NewsFormModalComponent`, `todayIsoDate` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [news.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-news-service-ts), [news-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-news-type-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [news-page.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts), [news-page.component.ts (plantilla)](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts) (plantilla)
- **Plantilla:** [news-form-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `NewsFormModalComponent` (L29–141)

- **Decoradores:** `@Component({ selector: 'app-news-form-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './news-form-modal.c`
- **Herencia / contratos:** implements OnChanges
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `newsService = inject(NewsService)`, `newsTypeService = inject(NewsTypeService)`, `confirmDialogService = inject(ConfirmDialogService)`
- **Datos / estado que administra:** `@Input open = false`, `@Input article = null`, `@Output closed = new EventEmitter<void>()`, `@Output saved = new EventEmitter<NewsArticle>()`, `isSubmitting = signal(false)`, `errorMessage = signal<string \| null>(null)`, `allTypes = signal<NewsType[]>([])`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isSelectableType` | método public | 66–68 | `type: NewsType` | `boolean` |
| `isEditMode` | getter public | 70–72 | — | `boolean` |
| `ngOnChanges` | método public | 74–89 | `changes: SimpleChanges` | `void` |
| `submit` | método public async | 91–127 | — | `Promise<void>` |
| `close` | método public async | 129–140 | — | `Promise<void>` |

##### `NewsFormModalComponent.isSelectableType`

- **Firma:** `isSelectableType(type: NewsType): boolean` — [news-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.ts#L66) (L66–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `news-form-modal.component.html` (plantilla)

##### `NewsFormModalComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [news-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.ts#L70) (L70–72)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsFormModalComponent.ngOnChanges`

- **Firma:** `ngOnChanges(changes: SimpleChanges): void` — [news-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.ts#L74) (L74–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting.set`, `this.form.reset`, `todayIsoDate`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsFormModalComponent.submit`

- **Firma:** `submit(): Promise<void>` — [news-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.ts#L91) (L91–127)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `raw.title.trim`, `raw.description.trim`, `this.isSubmitting.set`, `this.newsService.updateArticle`, `this.newsService.createArticle`, `request$.subscribe`, `this.saved.emit`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`; Emite eventos: `this.saved.emit`
- **Consumidores:** `news-form-modal.component.html` (plantilla)

##### `NewsFormModalComponent.close`

- **Firma:** `close(): Promise<void>` — [news-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.ts#L129) (L129–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `news-form-modal.component.html` (plantilla)

#### Función `todayIsoDate` (L22–27)

- **Tipo:** función local del archivo
- **Firma:** `todayIsoDate(): string` — [news-form-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.ts#L22)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `String(now.getMonth() + 1).padStart`, `String`, `now.getMonth`, `String(now.getDate()).padStart`, `now.getDate`, `now.getFullYear`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-image-modal-news-image-modal-component-ts"></a>

### news-image-modal.component.ts

- **Ruta:** [news-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.ts`, 111 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-news`
- **Responsabilidad:** Gestor de la imagen principal de una noticia — subir/reemplazar/eliminar.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [news.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-news-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [news-page.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts), [news-page.component.ts (plantilla)](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts) (plantilla)
- **Plantilla:** [news-image-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(change)="onFileSelected($event)"`, `(click)="removeImage()"`

#### Clase `NewsImageModalComponent` (L14–110)

- **Decoradores:** `@Component({ selector: 'app-news-image-modal', standalone: true, imports: [ButtonComponent, IconComponent], templateUrl: './news-image-modal.component.html', sty`
- **Propósito:** Gestor de la imagen principal de una noticia — subir/reemplazar/eliminar.
- **Servicios inyectados con `inject()`:** `newsService = inject(NewsService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `@Input article = null`, `@Output closed = new EventEmitter<void>()`, `@Output changed = new EventEmitter<NewsArticle>()`, `isUploading = signal(false)`, `isRemoving = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `open` | getter public | 35–37 | — | `boolean` |
| `imageUrl` | getter public | 39–41 | — | `string \| null` |
| `onFileSelected` | método public | 43–68 | `event: Event` | `void` |
| `removeImage` | método public async | 70–92 | — | `Promise<void>` |
| `close` | método public | 94–96 | — | `void` |
| `refetch` | método private | 98–109 | `articleId: string`, `done?: () => void` | `void` |

##### `NewsImageModalComponent.open`

- **Firma:** `open(): boolean` — [news-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsImageModalComponent.imageUrl`

- **Firma:** `imageUrl(): string \| null` — [news-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsService.getImageUrl`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsImageModalComponent.onFileSelected`

- **Firma:** `onFileSelected(event: Event): void` — [news-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.ts#L43) (L43–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `file.type.startsWith`, `this.notificationService.error`, `this.isUploading.set`, `this.newsService.setImage(article.id, file).subscribe`, `this.newsService.setImage`, `this.refetch`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isUploading.set`
- **Consumidores:** `news-image-modal.component.html` (plantilla)

##### `NewsImageModalComponent.removeImage`

- **Firma:** `removeImage(): Promise<void>` — [news-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.ts#L70) (L70–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.isRemoving.set`, `this.newsService.removeImage(article.id).subscribe`, `this.newsService.removeImage`, `this.refetch`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isRemoving.set`
- **Consumidores:** `news-image-modal.component.html` (plantilla)

##### `NewsImageModalComponent.close`

- **Firma:** `close(): void` — [news-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.ts#L94) (L94–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.closed.emit`
- **Efectos secundarios:** Emite eventos: `this.closed.emit`
- **Consumidores:** `news-image-modal.component.html` (plantilla)

##### `NewsImageModalComponent.refetch`

- **Firma:** `refetch(articleId: string, done?: () => void): void` — [news-image-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.ts#L98) (L98–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsService.getArticleById(articleId).subscribe`, `this.newsService.getArticleById`, `done`, `this.changed.emit`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Emite eventos: `this.changed.emit`
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-table-news-table-component-ts"></a>

### news-table.component.ts

- **Ruta:** [news-table.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-table/news-table.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/news/components/news-table/news-table.component.ts`, 33 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-news`
- **Responsabilidad:** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de Teléfonos/Librería/Variedades.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [news-page.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts), [news-page.component.ts (plantilla)](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts) (plantilla)
- **Plantilla:** [news-table.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-table/news-table.component.html) · **Usa componentes:** [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="clearFilters.emit()"`, `(click)="addArticle.emit()"`, `(click)="moveUp.emit(article)"`, `(click)="moveDown.emit(article)"`, `(click)="edit.emit(article)"`, `(click)="manageImage.emit(article)"`, `(click)="toggleActive.emit(article)"`

#### Clase `NewsTableComponent` (L10–32)

- **Decoradores:** `@Component({ selector: 'app-news-table', standalone: true, imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent], templateUrl:`
- **Propósito:** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de Teléfonos/Librería/Variedades.
- **Datos / estado que administra:** `@Input articles = []`, `@Input loading = false`, `@Input hasActiveFilters = false`, `@Output edit = new EventEmitter<NewsArticle>()`, `@Output manageImage = new EventEmitter<NewsArticle>()`, `@Output toggleActive = new EventEmitter<NewsArticle>()`, `@Output moveUp = new EventEmitter<NewsArticle>()`, `@Output moveDown = new EventEmitter<NewsArticle>()`, `@Output clearFilters = new EventEmitter<void>()`, `@Output addArticle = new EventEmitter<void>()`
<a id="f-comercial-jhoel-app-src-app-features-dashboard-news-news-page-component-ts"></a>

### news-page.component.ts

- **Ruta:** [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts`, 199 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-news`
- **Responsabilidad:** "Sistema → Noticias" — contenido editorial de la landing pública, NO un producto: título, imagen, descripción, fecha de publicación, orden, activo/inactivo.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [news.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-news-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts), [news-table.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-table-news-table-component-ts), [news-form-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-form-modal-news-form-modal-component-ts), [news-image-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-image-modal-news-image-modal-component-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [news-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [news-table.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-table-news-table-component-ts), [news-form-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-form-modal-news-form-modal-component-ts), [news-image-modal.component.ts](dashboard-news.md#f-comercial-jhoel-app-src-app-features-dashboard-news-components-news-image-modal-news-image-modal-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="openCreateForm()"`, `(ngModelChange)="searchTerm.set($event)"`, `(click)="statusFilter.set(option.value)"`, `(edit)="openEditForm($event)"`, `(manageImage)="openImage($event)"`, `(toggleActive)="toggleActive($event)"`, `(moveUp)="moveUp($event)"`, `(moveDown)="moveDown($event)"`, `(clearFilters)="clearFilters()"`, `(addArticle)="openCreateForm()"`, `(closed)="closeForm()"`, `(saved)="onArticleSaved($event)"`, `(closed)="closeImage()"`, `(changed)="onImageChanged($event)"`

**Interfaces, tipos y enums:**

- `type StatusFilter` (L15) = `'all' \| 'active' \| 'inactive'`

#### Clase `NewsPageComponent` (L23–198)

- **Decoradores:** `@Component({ selector: 'app-news-page', standalone: true, imports: [ FormsModule, PageHeaderComponent, ButtonComponent, IconComponent, NewsTableComponent, NewsFo`
- **Propósito:** "Sistema → Noticias" — contenido editorial de la landing pública, NO un producto: título, imagen, descripción, fecha de publicación, orden, activo/inactivo. Admin-only end to end (todo `NewsController` lo es en el backend, incluido el listado, porque expone noticias inactivas).
- **Servicios inyectados con `inject()`:** `newsService = inject(NewsService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `articles = signal<NewsArticle[]>([])`, `loading = signal(true)`, `searchTerm = signal('')`, `statusFilter = signal<StatusFilter>('all')`, `isFormOpen = signal(false)`, `editingArticle = signal<NewsArticle \| null>(null)`, `imageArticle = signal<NewsArticle \| null>(null)`, `filteredArticles = computed(() => { const term = this.searchTerm().tr`, `hasActiveFilters = computed(() => this.searchTerm().trim().length > 0`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchArticles` | método public | 79–91 | — | `void` |
| `clearFilters` | método public | 93–96 | — | `void` |
| `openCreateForm` | método public | 98–101 | — | `void` |
| `openEditForm` | método public | 103–106 | `article: NewsArticle` | `void` |
| `closeForm` | método public | 108–110 | — | `void` |
| `onArticleSaved` | método public | 112–126 | `article: NewsArticle` | `void` |
| `openImage` | método public | 128–130 | `article: NewsArticle` | `void` |
| `closeImage` | método public | 132–134 | — | `void` |
| `onImageChanged` | método public | 136–139 | `article: NewsArticle` | `void` |
| `toggleActive` | método public async | 141–164 | `article: NewsArticle` | `Promise<void>` |
| `moveUp` | método public | 166–173 | `article: NewsArticle` | `void` |
| `moveDown` | método public | 175–182 | `article: NewsArticle` | `void` |
| `swapOrder` | método private | 184–197 | `list: NewsArticle[]`, `indexA: number`, `indexB: number` | `void` |

##### `NewsPageComponent.fetchArticles`

- **Firma:** `fetchArticles(): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L79) (L79–91)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.newsService.getArticles(true).subscribe`, `this.newsService.getArticles`, `this.articles.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.articles.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsPageComponent.clearFilters`

- **Firma:** `clearFilters(): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L93) (L93–96)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.searchTerm.set`, `this.statusFilter.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.searchTerm.set`, `this.statusFilter.set`
- **Consumidores:** `news-page.component.html` (plantilla)

##### `NewsPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L98) (L98–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingArticle.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingArticle.set`, `this.isFormOpen.set`
- **Consumidores:** `news-page.component.html` (plantilla)

##### `NewsPageComponent.openEditForm`

- **Firma:** `openEditForm(article: NewsArticle): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L103) (L103–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingArticle.set`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingArticle.set`, `this.isFormOpen.set`
- **Consumidores:** `news-page.component.html` (plantilla)

##### `NewsPageComponent.closeForm`

- **Firma:** `closeForm(): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L108) (L108–110)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `news-page.component.html` (plantilla)

##### `NewsPageComponent.onArticleSaved`

- **Firma:** `onArticleSaved(article: NewsArticle): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L112) (L112–126)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingArticle`, `this.isFormOpen.set`, `this.articles.update`, `list.map`, `this.notificationService.success`, `this.imageArticle.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`, `this.articles.update`, `this.imageArticle.set`
- **Consumidores:** `news-page.component.html` (plantilla)

##### `NewsPageComponent.openImage`

- **Firma:** `openImage(article: NewsArticle): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L128) (L128–130)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageArticle.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageArticle.set`
- **Consumidores:** `news-page.component.html` (plantilla)

##### `NewsPageComponent.closeImage`

- **Firma:** `closeImage(): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L132) (L132–134)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageArticle.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageArticle.set`
- **Consumidores:** `news-page.component.html` (plantilla)

##### `NewsPageComponent.onImageChanged`

- **Firma:** `onImageChanged(article: NewsArticle): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L136) (L136–139)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.imageArticle.set`, `this.articles.update`, `list.map`
- **Efectos secundarios:** Actualiza estado (signals): `this.imageArticle.set`, `this.articles.update`
- **Consumidores:** `news-page.component.html` (plantilla)

##### `NewsPageComponent.toggleActive`

- **Firma:** `toggleActive(article: NewsArticle): Promise<void>` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L141) (L141–164)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.newsService.activateArticle`, `this.newsService.deactivateArticle`, `request$.subscribe`, `this.articles.update`, `list.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.articles.update`
- **Consumidores:** `news-page.component.html` (plantilla)

##### `NewsPageComponent.moveUp`

- **Firma:** `moveUp(article: NewsArticle): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L166) (L166–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.articles`, `list.findIndex`, `this.swapOrder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `news-page.component.html` (plantilla)

##### `NewsPageComponent.moveDown`

- **Firma:** `moveDown(article: NewsArticle): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L175) (L175–182)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.articles`, `list.findIndex`, `this.swapOrder`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `news-page.component.html` (plantilla)

##### `NewsPageComponent.swapOrder`

- **Firma:** `swapOrder(list: NewsArticle[], indexA: number, indexB: number): void` — [news-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts#L184) (L184–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `reordered.map`, `this.newsService.reorderArticles(items).subscribe`, `this.newsService.reorderArticles`, `this.articles.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.articles.set`
- **Consumidores:** (mismo archivo)

