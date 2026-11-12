# Frontend `auth`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [login-page.component.ts](#f-comercial-jhoel-app-src-app-features-auth-login-login-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Componente Angular: declara `LoginPageComponent` (sin comentario de documentación en el código). | 3 internas; ext.: @angular/core, @angular/forms, @angular/router | 1 | Baja (1 consumidores) |
| [login-page.component.html](../../../../comercial-jhoel-app/src/app/features/auth/login/login-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `login-page.component.ts`; usa 2 componentes hijos: `app-button`, `app-icon`. | — | — | Media |
| [login-page.component.scss](../../../../comercial-jhoel-app/src/app/features/auth/login/login-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-auth-login-login-page-component-ts"></a>

### login-page.component.ts

- **Ruta:** [login-page.component.ts](../../../../comercial-jhoel-app/src/app/features/auth/login/login-page.component.ts) (`comercial-jhoel-app/src/app/features/auth/login/login-page.component.ts`, 54 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `auth`
- **Responsabilidad:** Componente Angular: declara `LoginPageComponent` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [index.ts](core-data.md#f-comercial-jhoel-app-src-app-core-data-index-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`, `@angular/router`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [login-page.component.html](../../../../comercial-jhoel-app/src/app/features/auth/login/login-page.component.html) · **Usa componentes:** [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts)
- **Eventos enlazados en la plantilla:** `(ngSubmit)="submit()"`

#### Clase `LoginPageComponent` (L9–53)

- **Decoradores:** `@Component({ selector: 'app-login-page', standalone: true, imports: [ReactiveFormsModule, RouterLink, ButtonComponent, IconComponent], templateUrl: './login-page`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Servicios inyectados con `inject()`:** `fb = inject(FormBuilder)`, `authService = inject(AuthService)`, `router = inject(Router)`
- **Datos / estado que administra:** `errorMessage = signal<string \| null>(null)`, `isSubmitting = signal(false)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `submit` | método public | 31–52 | — | `void` |

##### `LoginPageComponent.submit`

- **Firma:** `submit(): void` — [login-page.component.ts](../../../../comercial-jhoel-app/src/app/features/auth/login/login-page.component.ts#L31) (L31–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.errorMessage.set`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.form.getRawValue`, `this.isSubmitting.set`, `this.authService.login(identifier, password).subscribe`, `this.authService.login`, `this.router.navigateByUrl`
- **Efectos secundarios:** Actualiza estado (signals): `this.errorMessage.set`, `this.isSubmitting.set`
- **Consumidores:** `login-page.component.html` (plantilla)

