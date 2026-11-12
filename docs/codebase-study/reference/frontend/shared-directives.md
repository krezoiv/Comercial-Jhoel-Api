# Frontend `shared-directives`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [decimal-input.directive.spec.ts](#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-spec-ts) | .ts | Prueba unitaria | Shared (UI reutilizable) | Prueba unitaria: declara `HostComponent`, `type` (sin comentario de documentación en el código). | 1 internas; ext.: @angular/core, @angular/forms | 0 | Soporte (pruebas) |
| [decimal-input.directive.ts](#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts) | .ts | Directiva Angular | Shared (UI reutilizable) | The one reusable way to accept a number from the user across this app — every price/monto/saldo/stock/cantidad field should use `&lt;input type="text" inputmode="decimal" appDecimalInput ...&gt;` (or `[appDecimalInput]="0"` for an integer-only field like stock) instead of `&lt;input type="number"&gt;`. | 0 internas; ext.: @angular/core, @angular/forms | 40 | Alta (40 consumidores) |
| [mouse-shift.directive.ts](#f-comercial-jhoel-app-src-app-shared-directives-mouse-shift-directive-ts) | .ts | Directiva Angular | Shared (UI reutilizable) | Desplazamiento sutil de posición (nunca rotación — ver `TiltOnMouseDirective` para el caso de cards) siguiendo el mouse dentro del propio host. | 0 internas; ext.: @angular/core | 1 | Baja (1 consumidores) |
| [parallax-layer.directive.ts](#f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts) | .ts | Directiva Angular | Shared (UI reutilizable) | Registers the host element with the app-wide `ParallaxService` so it drifts at its own speed as the page scrolls — the reusable building block behind every section's decorative depth (see each section's own `__glow` elements, which this directive attaches to directly rather than through a new wrappe | 1 internas; ext.: @angular/core | 9 | Media (9 consumidores) |
| [reveal-on-scroll.directive.ts](#f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts) | .ts | Directiva Angular | Shared (UI reutilizable) | Adds `.is-visible` to the host once it scrolls into view, using IntersectionObserver. | 0 internas; ext.: @angular/core | 10 | Alta (10 consumidores) |
| [tilt-on-mouse.directive.ts](#f-comercial-jhoel-app-src-app-shared-directives-tilt-on-mouse-directive-ts) | .ts | Directiva Angular | Shared (UI reutilizable) | Subtle mouse-reactive 3D tilt (`rotateX`/`rotateY`) — deliberately never touches the host's own `transform` directly. | 0 internas; ext.: @angular/core | 6 | Media (6 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-spec-ts"></a>

### decimal-input.directive.spec.ts

- **Ruta:** [decimal-input.directive.spec.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.spec.ts) (`comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.spec.ts`, 83 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-directives`
- **Responsabilidad:** Prueba unitaria: declara `HostComponent`, `type` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [decimal-input.directive.ts](shared-directives.md#f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts)
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** —

#### Clase `HostComponent` (L7–18)

- **Decoradores:** `@Component({ standalone: true, imports: [FormsModule, DecimalInputDirective], template: ' <input class="plain" appDecimalInput [(ngModel)]="plain" /> <input clas`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
#### Función `type` (L20–24)

- **Tipo:** función local del archivo
- **Firma:** `type(input: HTMLInputElement, value: string): void` — [decimal-input.directive.spec.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.spec.ts#L20)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `input.setSelectionRange`, `input.dispatchEvent`, `new Event`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-app-src-app-shared-directives-decimal-input-directive-ts"></a>

### decimal-input.directive.ts

- **Ruta:** [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts) (`comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts`, 252 líneas)
- **Tipo:** Directiva Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-directives`
- **Responsabilidad:** The one reusable way to accept a number from the user across this app — every price/monto/saldo/stock/cantidad field should use `&lt;input type="text" inputmode="decimal" appDecimalInput ...&gt;` (or `[appDecimalInput]="0"` for an integer-only field like stock) instead of `&lt;input type="number"&gt;`.
- **Paquetes externos:** `@angular/core`, `@angular/forms`
- **Consumidores:** [account-receivable-form-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-account-receivable-form-modal-account-receivable-form-modal-component-ts), [settlement-modal.component.ts](dashboard-accounts-receivable.md#f-comercial-jhoel-app-src-app-features-dashboard-accounts-receivable-components-settlement-modal-settlement-modal-component-ts), [asset-form-modal.component.ts](dashboard-assets.md#f-comercial-jhoel-app-src-app-features-dashboard-assets-components-asset-form-modal-asset-form-modal-component-ts), [bank-agents-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-bank-agents-page-component-ts), [adjust-balance-modal.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-components-adjust-balance-modal-adjust-balance-modal-component-ts), [cuadre-agentes-page.component.ts](dashboard-bank-agents.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-agents-cuadre-agentes-page-component-ts), [bank-transfers-page.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-bank-transfers-page-component-ts), [balance-credit.component.ts](dashboard-bank-transfers.md#f-comercial-jhoel-app-src-app-features-dashboard-bank-transfers-components-balance-credit-balance-credit-component-ts), [bank-form-modal.component.ts](dashboard-banks.md#f-comercial-jhoel-app-src-app-features-dashboard-banks-components-bank-form-modal-bank-form-modal-component-ts), [cash-bank-deposit-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-bank-deposit-modal-cash-bank-deposit-modal-component-ts), [cash-count-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-count-modal-cash-count-modal-component-ts), [cash-movement-form-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cash-movement-form-modal-cash-movement-form-modal-component-ts), [cut-control-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-control-panel-cut-control-panel-component-ts), [cut-finish-modal.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-cut-finish-modal-cut-finish-modal-component-ts), [warehouse-panel.component.ts](dashboard-cash-control.md#f-comercial-jhoel-app-src-app-features-dashboard-cash-control-components-warehouse-panel-warehouse-panel-component-ts) y 25 más

#### Clase `DecimalInputDirective` (L52–251)

- **Decoradores:** `@Directive({ selector: 'input[appDecimalInput]', standalone: true, providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DecimalInputDirective`
- **Herencia / contratos:** implements ControlValueAccessor
- **Propósito:** The one reusable way to accept a number from the user across this app — every price/monto/saldo/stock/cantidad field should use `&lt;input type="text" inputmode="decimal" appDecimalInput ...&gt;` (or `[appDecimalInput]="0"` for an integer-only field like stock) instead of `&lt;input type="number"&gt;`. `type="number"` is what created the bugs this directive exists to close for good: its native up/down spinner steps the value on an accidental arrow-key press or a mouse-wheel scroll while the field happens to be focused, and it silently accepts things like "1e5" or a second "-" that don't parse back predictably. A plain text input has none of that built in — nothing to disable, because none of it exists — so this directive only needs to add back the one thing a text input is missing: restricting *what* can be typed. When applied to a `formControlName`/`[(ngModel)]` host, this directive doubles as that
- **Servicios inyectados con `inject()`:** `renderer = inject(Renderer2)`
- **Datos / estado que administra:** `@Input appDecimalInput = 2`, `@Input allowNegative = false`, `@Input thousands = false`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onChange` | propiedad-función private | 80–80 | — | (inferido) |
| `onTouched` | propiedad-función private | 81–81 | — | (inferido) |
| `decimals` | getter private | 83–85 | — | `number` |
| `writeValue` | método public | 89–93 | `value: number \| string \| null` | `void` |
| `formatFull` | método private | 96–104 | `value: number` | `string` |
| `reformatWhileTyping` | método private | 112–137 | — | `void` |
| `registerOnChange` | método public | 139–141 | `fn: (value: number \| null) => void` | `void` |
| `registerOnTouched` | método public | 143–145 | `fn: () => void` | `void` |
| `setDisabledState` | método public | 147–149 | `isDisabled: boolean` | `void` |
| `onInput` | método public | 151–163 | — | `void` |
| `onBlur` | método public | 165–175 | — | `void` |
| `onFocus` | método public | 185–188 | — | `void` |
| `onKeyDown` | método public | 192–236 | `event: KeyboardEvent` | `void` |
| `onPaste` | método public | 238–250 | `event: ClipboardEvent` | `void` |

##### `DecimalInputDirective.onChange`

- **Firma:** `onChange()` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L80) (L80–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `DecimalInputDirective.onTouched`

- **Firma:** `onTouched()` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L81) (L81–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `DecimalInputDirective.decimals`

- **Firma:** `decimals(): number` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DecimalInputDirective.writeValue`

- **Firma:** `writeValue(value: number \| string \| null): void` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L89) (L89–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.formatFull`, `Number`, `String`, `this.renderer.setProperty`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DecimalInputDirective.formatFull`

- **Firma:** `formatFull(value: number): string` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L96) (L96–104)
- **Propósito / descripción:** `1234.5` → `"1,234.50"` (con `thousands`).
- **Dependencias (llamadas en su cuerpo):** `Number.isFinite`, `value.toLocaleString`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `DecimalInputDirective.reformatWhileTyping`

- **Firma:** `reformatWhileTyping(): void` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L112) (L112–137)
- **Propósito / descripción:** Reaplica los separadores de miles a lo que el usuario está escribiendo, sin rellenar decimales (respeta un "12." o "12.5" a medio escribir) y conservando la posición del cursor: se cuenta cuántos dígitos quedaban antes del cursor y se lo vuelve a poner después del mismo dígito.
- **Dependencias (llamadas en su cuerpo):** `raw.slice(0, caret).replace`, `raw.slice`, `raw.startsWith`, `raw.replace`, `clean.split`, `integerPart.replace(/^0+(?=\d)/, '').replace`, `integerPart.replace`, `rest.join`, `/[0-9.]/.test`, `input.setSelectionRange`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `DecimalInputDirective.registerOnChange`

- **Firma:** `registerOnChange(fn: (value: number \| null) => void): void` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L139) (L139–141)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DecimalInputDirective.registerOnTouched`

- **Firma:** `registerOnTouched(fn: () => void): void` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L143) (L143–145)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DecimalInputDirective.setDisabledState`

- **Firma:** `setDisabledState(isDisabled: boolean): void` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L147) (L147–149)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.renderer.setProperty`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DecimalInputDirective.onInput`

- **Firma:** `onInput(): void` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L151) (L151–163)
- **Decoradores:** `@HostListener('input')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.reformatWhileTyping`, `this.el.nativeElement.value.replace(/,/g, '').trim`, `this.el.nativeElement.value.replace`, `this.onChange`, `Number`, `Number.isFinite`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DecimalInputDirective.onBlur`

- **Firma:** `onBlur(): void` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L165) (L165–175)
- **Decoradores:** `@HostListener('blur')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.el.nativeElement.value.replace(/,/g, '').trim`, `this.el.nativeElement.value.replace`, `Number`, `Number.isFinite`, `this.formatFull`, `this.onTouched`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DecimalInputDirective.onFocus`

- **Firma:** `onFocus(): void` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L185) (L185–188)
- **Decoradores:** `@HostListener('focus')`
- **Propósito / descripción:** Selects the whole current value on focus — so replacing it is a single keystroke (type over the selection, or one Delete/Backspace) instead of having to repeatedly press Backspace to clear a stale amount/quantity first. Applies everywhere this directive already does (every price, cantidad, saldo, stock field in the app), so this one change covers all of them at once rather than needing a per-field opt-in.
- **Dependencias (llamadas en su cuerpo):** `this.el.nativeElement.select`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DecimalInputDirective.onKeyDown`

- **Firma:** `onKeyDown(event: KeyboardEvent): void` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L192) (L192–236)
- **Decoradores:** `@HostListener('keydown', ['$event'])`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `NAVIGATION_KEYS.has`, `value.includes`, `event.preventDefault`, `/^[0-9]$/.test`, `value.indexOf`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `DecimalInputDirective.onPaste`

- **Firma:** `onPaste(event: ClipboardEvent): void` — [decimal-input.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/decimal-input.directive.ts#L238) (L238–250)
- **Decoradores:** `@HostListener('paste', ['$event'])`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `(event.clipboardData?.getData('text') ?? '').trim`, `event.clipboardData?.getData`, `text.replace`, `new RegExp`, `pattern.test`, `event.preventDefault`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-shared-directives-mouse-shift-directive-ts"></a>

### mouse-shift.directive.ts

- **Ruta:** [mouse-shift.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/mouse-shift.directive.ts) (`comercial-jhoel-app/src/app/shared/directives/mouse-shift.directive.ts`, 79 líneas)
- **Tipo:** Directiva Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-directives`
- **Responsabilidad:** Desplazamiento sutil de posición (nunca rotación — ver `TiltOnMouseDirective` para el caso de cards) siguiendo el mouse dentro del propio host.
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [landing-background-layer.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-landing-background-layer-landing-background-layer-component-ts)

#### Clase `MouseShiftDirective` (L17–78)

- **Decoradores:** `@Directive({ selector: '[appMouseShift]', standalone: true, })`
- **Herencia / contratos:** implements AfterViewInit, OnDestroy
- **Propósito:** Desplazamiento sutil de posición (nunca rotación — ver `TiltOnMouseDirective` para el caso de cards) siguiendo el mouse dentro del propio host. Escribe `--shift-x`/`--shift-y` (píxeles) como custom properties en el host — nunca toca `transform` directamente — así cualquier descendiente puede leerlas vía herencia normal de CSS custom properties y componerlas con sus propias transformaciones (mismo convenio ya usado por `HeroComponent`'s `--mx`/`--my`, que `.hero__cursor-light` lee igual de un ancestro). Nunca se adjunta en touch (`hover: hover` falso) ni con `prefers-reduced-motion: reduce` — comprobado una sola vez, no por evento.
- **Servicios inyectados con `inject()`:** `el = inject(ElementRef<HTMLElement>)`
- **Datos / estado que administra:** `@Input enabled = true`, `@Input maxShift = 10`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngAfterViewInit` | método public | 30–44 | — | `void` |
| `ngOnDestroy` | método public | 46–56 | — | `void` |
| `onMove` | propiedad-función private | 58–71 | `event: MouseEvent` | `void` |
| `onLeave` | propiedad-función private | 73–77 | — | `void` |

##### `MouseShiftDirective.ngAfterViewInit`

- **Firma:** `ngAfterViewInit(): void` — [mouse-shift.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/mouse-shift.directive.ts#L30) (L30–44)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `window.matchMedia`, `host.addEventListener`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `MouseShiftDirective.ngOnDestroy`

- **Firma:** `ngOnDestroy(): void` — [mouse-shift.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/mouse-shift.directive.ts#L46) (L46–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `cancelAnimationFrame`, `host.removeEventListener`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `MouseShiftDirective.onMove`

- **Firma:** `onMove(event: MouseEvent): void` — [mouse-shift.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/mouse-shift.directive.ts#L58) (L58–71)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `requestAnimationFrame`, `this.el.nativeElement.getBoundingClientRect`, `style.setProperty`, `(px * this.maxShift * 2).toFixed`, `(py * this.maxShift * 2).toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `MouseShiftDirective.onLeave`

- **Firma:** `onLeave(): void` — [mouse-shift.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/mouse-shift.directive.ts#L73) (L73–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `style.setProperty`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-shared-directives-parallax-layer-directive-ts"></a>

### parallax-layer.directive.ts

- **Ruta:** [parallax-layer.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/parallax-layer.directive.ts) (`comercial-jhoel-app/src/app/shared/directives/parallax-layer.directive.ts`, 38 líneas)
- **Tipo:** Directiva Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-directives`
- **Responsabilidad:** Registers the host element with the app-wide `ParallaxService` so it drifts at its own speed as the page scrolls — the reusable building block behind every section's decorative depth (see each section's own `__glow` elements, which this directive attaches to directly rather than through a new wrappe
- **Depende de (archivos del proyecto):** [parallax.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-parallax-service-ts)
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [about.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-about-about-component-ts), [catalog-banks.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts), [catalog-preview.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-preview-catalog-preview-component-ts), [hero.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-hero-hero-component-ts), [library-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts), [phones.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts), [services.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-services-services-component-ts), [varieties-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts), [landing-background-layer.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-landing-background-layer-landing-background-layer-component-ts)

#### Clase `ParallaxLayerDirective` (L20–37)

- **Decoradores:** `@Directive({ selector: '[appParallaxLayer]', standalone: true, })`
- **Herencia / contratos:** implements AfterViewInit, OnDestroy
- **Propósito:** Registers the host element with the app-wide `ParallaxService` so it drifts at its own speed as the page scrolls — the reusable building block behind every section's decorative depth (see each section's own `__glow` elements, which this directive attaches to directly rather than through a new wrapper component: they already exist in every catalog/services/about/contact section, so this is pure augmentation, never a duplicate background system). `[appParallaxLayer]` doubles as its own speed input (same convention as `ngModel`) — a small number, typically 0.03–0.25: background elements use a smaller speed (drift less), foreground ones a larger speed (drift more), which is what actually reads as "depth" rather than everything moving in lockstep with the page.
- **Servicios inyectados con `inject()`:** `el = inject(ElementRef<HTMLElement>)`, `parallax = inject(ParallaxService)`
- **Datos / estado que administra:** `@Input speed = 0.08`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngAfterViewInit` | método public | 30–32 | — | `void` |
| `ngOnDestroy` | método public | 34–36 | — | `void` |

##### `ParallaxLayerDirective.ngAfterViewInit`

- **Firma:** `ngAfterViewInit(): void` — [parallax-layer.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/parallax-layer.directive.ts#L30) (L30–32)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.parallax.register`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `ParallaxLayerDirective.ngOnDestroy`

- **Firma:** `ngOnDestroy(): void` — [parallax-layer.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/parallax-layer.directive.ts#L34) (L34–36)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.parallax.unregister`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-shared-directives-reveal-on-scroll-directive-ts"></a>

### reveal-on-scroll.directive.ts

- **Ruta:** [reveal-on-scroll.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/reveal-on-scroll.directive.ts) (`comercial-jhoel-app/src/app/shared/directives/reveal-on-scroll.directive.ts`, 54 líneas)
- **Tipo:** Directiva Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-directives`
- **Responsabilidad:** Adds `.is-visible` to the host once it scrolls into view, using IntersectionObserver.
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [about.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-about-about-component-ts), [bank-agents.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-bank-agents-bank-agents-component-ts), [catalog-banks.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-catalog-banks-component-ts), [catalog-preview.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-preview-catalog-preview-component-ts), [credibility.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-credibility-credibility-component-ts), [library-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-library-catalog-library-catalog-component-ts), [news.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-news-component-ts), [phones.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-phones-component-ts), [services.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-services-services-component-ts), [varieties-catalog.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-varieties-catalog-varieties-catalog-component-ts)

**Interfaces, tipos y enums:**

- `type RevealVariant` (L4) = `'up' \| 'fade' \| 'scale' \| 'left' \| 'right'` — Variante de entrada — `up` (por defecto) = fade + translateY; ver `.reveal--*` en styles/_base.scss.

#### Clase `RevealOnScrollDirective` (L12–53)

- **Decoradores:** `@Directive({ selector: '[appRevealOnScroll]', standalone: true, host: { class: 'reveal', }, })`
- **Herencia / contratos:** implements AfterViewInit, OnDestroy
- **Propósito:** Adds `.is-visible` to the host once it scrolls into view, using IntersectionObserver. Pair with the `.reveal` utility class in styles/_base.scss (or a component-local equivalent) for the actual fade/slide transition — this directive only toggles state.
- **Servicios inyectados con `inject()`:** `el = inject(ElementRef<HTMLElement>)`
- **Datos / estado que administra:** `@Input revealDelay = 0`, `@Input revealVariant = 'up'`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngAfterViewInit` | método public | 26–48 | — | `void` |
| `ngOnDestroy` | método public | 50–52 | — | `void` |

##### `RevealOnScrollDirective.ngAfterViewInit`

- **Firma:** `ngAfterViewInit(): void` — [reveal-on-scroll.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/reveal-on-scroll.directive.ts#L26) (L26–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.el.nativeElement.classList.add`, `this.el.nativeElement.style.setProperty`, `new IntersectionObserver`, `this.observer?.disconnect`, `this.observer.observe`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `RevealOnScrollDirective.ngOnDestroy`

- **Firma:** `ngOnDestroy(): void` — [reveal-on-scroll.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/reveal-on-scroll.directive.ts#L50) (L50–52)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.observer?.disconnect`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-app-src-app-shared-directives-tilt-on-mouse-directive-ts"></a>

### tilt-on-mouse.directive.ts

- **Ruta:** [tilt-on-mouse.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/tilt-on-mouse.directive.ts) (`comercial-jhoel-app/src/app/shared/directives/tilt-on-mouse.directive.ts`, 99 líneas)
- **Tipo:** Directiva Angular · **Capa:** Shared (UI reutilizable) · **Módulo:** Frontend `shared-directives`
- **Responsabilidad:** Subtle mouse-reactive 3D tilt (`rotateX`/`rotateY`) — deliberately never touches the host's own `transform` directly.
- **Paquetes externos:** `@angular/core`
- **Consumidores:** [bank-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-catalog-banks-components-bank-card-bank-card-component-ts), [news-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-news-components-news-card-news-card-component-ts), [phone-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-phones-components-phone-card-phone-card-component-ts), [services.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-services-services-component-ts), [catalog-product-card.component.ts](landing.md#f-comercial-jhoel-app-src-app-features-landing-sections-shared-catalog-product-card-catalog-product-card-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts)

#### Clase `TiltOnMouseDirective` (L29–98)

- **Decoradores:** `@Directive({ selector: '[appTiltOnMouse]', standalone: true, })`
- **Herencia / contratos:** implements AfterViewInit, OnDestroy
- **Propósito:** Subtle mouse-reactive 3D tilt (`rotateX`/`rotateY`) — deliberately never touches the host's own `transform` directly. Instead it writes two CSS custom properties, `--tilt-x`/`--tilt-y`, and the CONSUMING stylesheet (e.g. `card.component.scss`'s `.card--tilt`) is the one that folds them into its own `transform` chain alongside whatever hover-lift (`translateY`) that element already has. This is what lets a card keep its existing CSS `:hover` lift working unmodified while also tilting — an inline `style.transform` write from here would silently win over (and kill) that `:hover` rule's own `transform`, since an inline style always beats an external stylesheet rule, `:hover` included. Never attached at all — not just visually neutered — on a touch device (`(hover: hover)` false) or under `prefers-reduced-motion: reduce`, checked once, not per event. `[appTiltOnMouse]` doubles as an enable/di
- **Servicios inyectados con `inject()`:** `el = inject(ElementRef<HTMLElement>)`
- **Datos / estado que administra:** `@Input enabled = true`, `@Input tiltMax = 6`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `ngAfterViewInit` | método public | 42–56 | — | `void` |
| `ngOnDestroy` | método public | 58–68 | — | `void` |
| `onMove` | propiedad-función private | 70–87 | `event: MouseEvent` | `void` |
| `onLeave` | propiedad-función private | 89–97 | — | `void` |

##### `TiltOnMouseDirective.ngAfterViewInit`

- **Firma:** `ngAfterViewInit(): void` — [tilt-on-mouse.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/tilt-on-mouse.directive.ts#L42) (L42–56)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `window.matchMedia`, `host.addEventListener`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TiltOnMouseDirective.ngOnDestroy`

- **Firma:** `ngOnDestroy(): void` — [tilt-on-mouse.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/tilt-on-mouse.directive.ts#L58) (L58–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `cancelAnimationFrame`, `host.removeEventListener`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TiltOnMouseDirective.onMove`

- **Firma:** `onMove(event: MouseEvent): void` — [tilt-on-mouse.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/tilt-on-mouse.directive.ts#L70) (L70–87)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `requestAnimationFrame`, `this.el.nativeElement.getBoundingClientRect`, `style.setProperty`, `(px * this.tiltMax * 2).toFixed`, `(-py * this.tiltMax * 2).toFixed`, `((px + 0.5) * 100).toFixed`, `((py + 0.5) * 100).toFixed`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TiltOnMouseDirective.onLeave`

- **Firma:** `onLeave(): void` — [tilt-on-mouse.directive.ts](../../../../comercial-jhoel-app/src/app/shared/directives/tilt-on-mouse.directive.ts#L89) (L89–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `cancelAnimationFrame`, `style.setProperty`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

