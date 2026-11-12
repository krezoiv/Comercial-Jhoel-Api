# Frontend `dashboard-change-password-modal`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [change-password-modal.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-change-password-modal-change-password-modal-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `ChangePasswordModalComponent`, `passwordsMatchValidator` (sin comentario de documentación en el código). | 2 internas; ext.: @angular/core, @angular/forms | 2 | Baja (2 consumidores) |
| [change-password-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/change-password-modal/change-password-modal.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `change-password-modal.component.ts`; usa 2 componentes hijos: `app-icon`, `app-button`. | — | — | Media |
| [change-password-modal.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/change-password-modal/change-password-modal.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-change-password-modal-change-password-modal-component-ts"></a>

### change-password-modal.component.ts

- **Ruta:** [change-password-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/change-password-modal/change-password-modal.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/change-password-modal/change-password-modal.component.ts`, 72 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-change-password-modal`
- **Responsabilidad:** Componente Angular: declara `ChangePasswordModalComponent`, `passwordsMatchValidator` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [dashboard-layout.component.ts](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts), [dashboard-layout.component.ts (plantilla)](dashboard.md#f-comercial-jhoel-app-src-app-features-dashboard-dashboard-layout-component-ts) (plantilla)
- **Plantilla:** [change-password-modal.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/change-password-modal/change-password-modal.component.html) · **Usa componentes:** [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="$event.stopPropagation()"`, `(click)="close()"`, `(ngSubmit)="submit()"`

#### Clase `ChangePasswordModalComponent` (L13–71)

- **Decoradores:** `@Component({ selector: 'app-change-password-modal', standalone: true, imports: [ReactiveFormsModule, ButtonComponent, IconComponent], templateUrl: './change-pass`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `authService = inject(AuthService)`
- **Datos / estado que administra:** `@Input open = false`, `@Output closed = new EventEmitter<void>()`, `errorMessage = signal<string \| null>(null)`, `isSuccess = signal(false)`, `isSubmitting = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `submit` | método public | 41–62 | — | `void` |
| `close` | método public | 64–70 | — | `void` |

##### `ChangePasswordModalComponent.submit`

- **Firma:** `submit(): void` — [change-password-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/change-password-modal/change-password-modal.component.ts#L41) (L41–62)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.authService.changePassword(currentPassword, newPassword).subscribe`, `this.authService.changePassword`, `this.isSuccess.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`, `this.isSuccess.set`
- **Consumidores:** `change-password-modal.component.html` (plantilla)

##### `ChangePasswordModalComponent.close`

- **Firma:** `close(): void` — [change-password-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/change-password-modal/change-password-modal.component.ts#L64) (L64–70)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.form.reset`, `this.errorMessage.set`, `this.isSuccess.set`, `this.isSubmitting.set`, `this.closed.emit`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSuccess.set`, `this.isSubmitting.set`; Emite eventos: `this.closed.emit`
- **Consumidores:** `change-password-modal.component.html` (plantilla)

#### Función `passwordsMatchValidator` (L7–11)

- **Tipo:** función local del archivo
- **Firma:** `passwordsMatchValidator(control: AbstractControl): ValidationErrors \| null` — [change-password-modal.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/change-password-modal/change-password-modal.component.ts#L7)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `control.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

