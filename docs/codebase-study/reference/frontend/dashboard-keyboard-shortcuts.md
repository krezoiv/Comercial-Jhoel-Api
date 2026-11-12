# Frontend `dashboard-keyboard-shortcuts`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [keyboard-shortcuts-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-keyboard-shortcuts-keyboard-shortcuts-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | "Sistema → Atajos de Teclado" — lets an admin register/edit/desactivate global keyboard shortcuts (e.g. | 8 internas; ext.: @angular/common, @angular/core, @angular/forms, rxjs | 1 | Baja (1 consumidores) |
| [keyboard-shortcuts-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `keyboard-shortcuts-page.component.ts`; usa 5 componentes hijos: `app-page-header`, `app-button`, `app-icon`, `app-empty-state`, `app-badge`. | — | — | Media |
| [keyboard-shortcuts-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-keyboard-shortcuts-keyboard-shortcuts-page-component-ts"></a>

### keyboard-shortcuts-page.component.ts

- **Ruta:** [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts`, 258 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-keyboard-shortcuts`
- **Responsabilidad:** "Sistema → Atajos de Teclado" — lets an admin register/edit/desactivate global keyboard shortcuts (e.g.
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [keyboard-shortcut.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-keyboard-shortcut-service-ts), [keyboard-shortcuts.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-keyboard-shortcuts-service-ts), [confirm-dialog.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-confirm-dialog-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [shortcut-route-options.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-shortcut-route-options-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`, `@angular/forms`, `rxjs`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [keyboard-shortcuts-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [empty-state.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-empty-state-empty-state-component-ts), [badge.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-badge-badge-component-ts)
- **Eventos enlazados en la plantilla:** `(click)="openCreateForm()"`, `(click)="openEditForm(item)"`, `(click)="toggleActive(item)"`, `(click)="$event.stopPropagation()"`, `(click)="closeForm()"`, `(ngSubmit)="submit()"`, `(keydown)="onComboCapture($event)"`

**Interfaces, tipos y enums:**

- `interface CapturedCombo` (L18): sin documentación — miembros: `key`, `altKey`, `ctrlKey`, `shiftKey`, `metaKey`

#### Clase `KeyboardShortcutsPageComponent` (L40–257)

- **Decoradores:** `@Component({ selector: 'app-keyboard-shortcuts-page', standalone: true, imports: [ReactiveFormsModule, BadgeComponent, ButtonComponent, EmptyStateComponent, Icon`
- **Propósito:** "Sistema → Atajos de Teclado" — lets an admin register/edit/desactivate global keyboard shortcuts (e.g. Alt+F12 → Inventario) without touching code. Self-contained, like `PresentationTypesTabComponent` — fetches and mutates directly; a route's own `adminGuard` already keeps a non-admin from ever reaching this page. Right after any create/update/deactivate succeeds, this page calls `KeyboardShortcutsService.refresh()` so the change takes effect immediately for the currently-open session, without requiring a full page reload — the same "the write's own response drives a sibling refresh" pattern already used elsewhere in this app (e.g. Recargas' `closureSaved` → table refetch).
- **Servicios inyectados con `inject()`:** `keyboardShortcutService = inject(KeyboardShortcutService)`, `keyboardShortcutsService = inject(KeyboardShortcutsService)`, `confirmDialogService = inject(ConfirmDialogService)`, `notificationService = inject(NotificationService)`, `fb = inject(FormBuilder)`
- **Datos / estado que administra:** `items = signal<KeyboardShortcut[]>([])`, `loading = signal(true)`, `isFormOpen = signal(false)`, `editingItem = signal<KeyboardShortcut \| null>(null)`, `isSubmitting = signal(false)`, `formError = signal<string \| null>(null)`, `capturedCombo = signal<CapturedCombo \| null>(null)`, `totalCount = computed(() => this.items().length)`, `activeCount = computed(() => this.items().filter((i) => i.isActi`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `isEditMode` | getter public | 76–78 | — | `boolean` |
| `comboLabel` | getter public | 80–83 | — | `string` |
| `fetch` | método private | 89–101 | — | `void` |
| `describeCombo` | método public | 103–111 | `combo: CapturedCombo` | `string` |
| `routeLabel` | método public | 113–115 | `route: string` | `string` |
| `onComboCapture` | método public | 118–136 | `event: KeyboardEvent` | `void` |
| `openCreateForm` | método public | 138–144 | — | `void` |
| `openEditForm` | método public | 146–158 | `item: KeyboardShortcut` | `void` |
| `closeForm` | método public async | 160–171 | — | `Promise<void>` |
| `submit` | método public async | 173–222 | — | `Promise<void>` |
| `toggleActive` | método public async | 224–256 | `item: KeyboardShortcut` | `Promise<void>` |

##### `KeyboardShortcutsPageComponent.isEditMode`

- **Firma:** `isEditMode(): boolean` — [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts#L76) (L76–78)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcutsPageComponent.comboLabel`

- **Firma:** `comboLabel(): string` — [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts#L80) (L80–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.capturedCombo`, `this.describeCombo`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcutsPageComponent.fetch`

- **Firma:** `fetch(): void` — [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts#L89) (L89–101)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.keyboardShortcutService.getShortcuts(true).subscribe`, `this.keyboardShortcutService.getShortcuts`, `this.items.set`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.items.set`
- **Consumidores:** (mismo archivo)

##### `KeyboardShortcutsPageComponent.describeCombo`

- **Firma:** `describeCombo(combo: CapturedCombo): string` — [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts#L103) (L103–111)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `parts.push`, `combo.key.toUpperCase`, `parts.join`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `keyboard-shortcuts-page.component.html` (plantilla), (mismo archivo)

##### `KeyboardShortcutsPageComponent.routeLabel`

- **Firma:** `routeLabel(route: string): string` — [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts#L113) (L113–115)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.routeOptions.find`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `keyboard-shortcuts-page.component.html` (plantilla)

##### `KeyboardShortcutsPageComponent.onComboCapture`

- **Firma:** `onComboCapture(event: KeyboardEvent): void` — [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts#L118) (L118–136)
- **Propósito / descripción:** Captures a real `keydown` inside the "combinación" field — never lets the admin hand-type a key name (avoids typos like "f11" that would still work, but also avoids "F 11"/"F11 " style mistakes that wouldn't). Ignores a lone modifier press (Alt/Ctrl/Shift/Meta by itself is not a combo).
- **Dependencias (llamadas en su cuerpo):** `event.preventDefault`, `new Set`, `pureModifierKeys.has`, `this.formError.set`, `this.capturedCombo.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.formError.set`, `this.capturedCombo.set`
- **Consumidores:** `keyboard-shortcuts-page.component.html` (plantilla)

##### `KeyboardShortcutsPageComponent.openCreateForm`

- **Firma:** `openCreateForm(): void` — [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts#L138) (L138–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingItem.set`, `this.formError.set`, `this.capturedCombo.set`, `this.form.reset`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingItem.set`, `this.formError.set`, `this.capturedCombo.set`, `this.isFormOpen.set`
- **Consumidores:** `keyboard-shortcuts-page.component.html` (plantilla)

##### `KeyboardShortcutsPageComponent.openEditForm`

- **Firma:** `openEditForm(item: KeyboardShortcut): void` — [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts#L146) (L146–158)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.editingItem.set`, `this.formError.set`, `this.capturedCombo.set`, `this.form.reset`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.editingItem.set`, `this.formError.set`, `this.capturedCombo.set`, `this.isFormOpen.set`
- **Consumidores:** `keyboard-shortcuts-page.component.html` (plantilla)

##### `KeyboardShortcutsPageComponent.closeForm`

- **Firma:** `closeForm(): Promise<void>` — [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts#L160) (L160–171)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.isSubmitting`, `this.confirmDialogService.confirm`, `this.isFormOpen.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.isFormOpen.set`
- **Consumidores:** `keyboard-shortcuts-page.component.html` (plantilla)

##### `KeyboardShortcutsPageComponent.submit`

- **Firma:** `submit(): Promise<void>` — [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts#L173) (L173–222)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.formError.set`, `this.capturedCombo`, `this.isSubmitting`, `this.form.markAllAsTouched`, `this.confirmDialogService.confirm`, `this.form.getRawValue`, `this.editingItem`, `label.trim`, `this.isSubmitting.set`, `this.keyboardShortcutService.updateShortcut`, `this.keyboardShortcutService.createShortcut`, `request$.subscribe`, `this.isFormOpen.set`, `this.notificationService.success`, `this.fetch`, `this.keyboardShortcutsService.refresh`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.formError.set`, `this.isSubmitting.set`, `this.isFormOpen.set`
- **Consumidores:** `keyboard-shortcuts-page.component.html` (plantilla)

##### `KeyboardShortcutsPageComponent.toggleActive`

- **Firma:** `toggleActive(item: KeyboardShortcut): Promise<void>` — [keyboard-shortcuts-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts#L224) (L224–256)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.confirmDialogService.confirm`, `this.keyboardShortcutService.updateShortcut`, `this.keyboardShortcutService.deactivateShortcut`, `request$.subscribe`, `this.notificationService.success`, `this.fetch`, `this.keyboardShortcutsService.refresh`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `keyboard-shortcuts-page.component.html` (plantilla)

