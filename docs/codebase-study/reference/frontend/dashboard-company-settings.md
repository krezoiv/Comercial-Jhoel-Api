# Frontend `dashboard-company-settings`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [company-settings-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-company-settings-company-settings-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Admin-only "Configuración de Empresa" screen — edits the one, always-existing `company_settings` row (logo/nombre/dirección/teléfono/correo/NIT/redes sociales) every document PDF (Venta, Compra, Ticket, Cotización) reads its letterhead from. | 5 internas; ext.: @angular/common, @angular/core, @angular/forms | 1 | Baja (1 consumidores) |
| [company-settings-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/company-settings/company-settings-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `company-settings-page.component.ts`; usa 4 componentes hijos: `app-page-header`, `app-icon`, `app-card`, `app-button`. | — | — | Media |
| [company-settings-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/company-settings/company-settings-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-company-settings-company-settings-page-component-ts"></a>

### company-settings-page.component.ts

- **Ruta:** [company-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/company-settings/company-settings-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/company-settings/company-settings-page.component.ts`, 175 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-company-settings`
- **Responsabilidad:** Admin-only "Configuración de Empresa" screen — edits the one, always-existing `company_settings` row (logo/nombre/dirección/teléfono/correo/NIT/redes sociales) every document PDF (Venta, Compra, Ticket, Cotización) reads its letterhead from.
- **Depende de (archivos del proyecto):** [company-settings.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-company-settings-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [company-settings-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/company-settings/company-settings-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(ngSubmit)="save()"`, `(change)="onLogoFileSelected($event)"`, `(click)="removeLogo()"`

#### Clase `CompanySettingsPageComponent` (L26–174)

- **Decoradores:** `@Component({ selector: 'app-company-settings-page', standalone: true, imports: [ReactiveFormsModule, DatePipe, PageHeaderComponent, ButtonComponent, CardComponen`
- **Propósito:** Admin-only "Configuración de Empresa" screen — edits the one, always-existing `company_settings` row (logo/nombre/dirección/teléfono/correo/NIT/redes sociales) every document PDF (Venta, Compra, Ticket, Cotización) reads its letterhead from. Route is already `adminGuard`-gated in `app.routes.ts`, same "already unreachable for a non-admin" reasoning as `alert-settings`. There is no file-upload backend (no multer/static-serving anywhere in this project) — the logo is stored as a plain base64 string, read client-side via `FileReader` and stripped of its `data:...;base64,` prefix before submission, matching what `Buffer.from(logoBase64, 'base64')` expects on the backend.
- **Servicios inyectados con `inject()`:** `companySettingsService = inject(CompanySettingsService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`, `fb = inject(FormBuilder)`
- **Datos / estado que administra:** `loading = signal(true)`, `isSaving = signal(false)`, `logoBase64 = signal<string \| null>(null)`, `updatedByUsername = signal<string \| null>(null)`, `updatedAt = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onLogoFileSelected` | método public | 94–119 | `event: Event` | `void` |
| `removeLogo` | método public | 121–123 | — | `void` |
| `save` | método public async | 125–173 | — | `Promise<void>` |

##### `CompanySettingsPageComponent.onLogoFileSelected`

- **Firma:** `onLogoFileSelected(event: Event): void` — [company-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/company-settings/company-settings-page.component.ts#L94) (L94–119)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `file.type.startsWith`, `this.notificationService.error`, `new FileReader`, `String`, `dataUrl.split`, `this.logoBase64.set`, `reader.readAsDataURL`
- **Efectos secundarios:** Actualiza estado (signals): `this.logoBase64.set`
- **Consumidores:** `company-settings-page.component.html` (plantilla)

##### `CompanySettingsPageComponent.removeLogo`

- **Firma:** `removeLogo(): void` — [company-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/company-settings/company-settings-page.component.ts#L121) (L121–123)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.logoBase64.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.logoBase64.set`
- **Consumidores:** `company-settings-page.component.html` (plantilla)

##### `CompanySettingsPageComponent.save`

- **Firma:** `save(): Promise<void>` — [company-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/company-settings/company-settings-page.component.ts#L125) (L125–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSaving`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.isSaving.set`, `this.companySettingsService.updateCompanySettings`, `raw.address.trim`, `raw.phone.trim`, `raw.email.trim`, `raw.taxId.trim`, `raw.socialMedia.trim`, `raw.whatsapp.trim`, `raw.website.trim`, `raw.businessHours.trim`, `raw.facebookUrl.trim`, `raw.instagramUrl.trim`, `raw.tiktokUrl.trim`, `this.logoBase64`…
- **Efectos secundarios:** Actualiza estado (signals): `this.isSaving.set`, `this.updatedByUsername.set`, `this.updatedAt.set`
- **Consumidores:** `company-settings-page.component.html` (plantilla)

