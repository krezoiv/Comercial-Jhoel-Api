# Frontend `dashboard-alert-settings`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [alert-settings-page.component.ts](#f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts) | .ts | Componente Angular | Feature (pantalla) | Admin-only screen for the DB-persisted alert thresholds: días de anticipación de pago (global, one row) and saldo mínimo per recharge type (Claro/Tigo, independently). | 6 internas; ext.: @angular/common, @angular/core | 1 | Baja (1 consumidores) |
| [alert-settings-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.html) | .html | Plantilla HTML | Feature (pantalla) | Plantilla de `alert-settings-page.component.ts`; usa 4 componentes hijos: `app-page-header`, `app-icon`, `app-card`, `app-button`. | — | — | Media |
| [alert-settings-page.component.scss](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.scss) | .scss | Estilos SCSS | Feature (pantalla) | Estilos del componente del mismo nombre. | — | — | Baja |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-app-features-dashboard-alert-settings-alert-settings-page-component-ts"></a>

### alert-settings-page.component.ts

- **Ruta:** [alert-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts) (`comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts`, 174 líneas)
- **Tipo:** Componente Angular · **Capa:** Feature (pantalla) · **Módulo:** Frontend `dashboard-alert-settings`
- **Responsabilidad:** Admin-only screen for the DB-persisted alert thresholds: días de anticipación de pago (global, one row) and saldo mínimo per recharge type (Claro/Tigo, independently).
- **Depende de (archivos del proyecto):** [index.ts](core-models.md#f-comercial-jhoel-app-src-app-core-models-index-ts), [alert-settings.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-alert-settings-service-ts), [recharges.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-recharges-service-ts), [notification.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-notification-service-ts), [extract-error-message.ts](core-utils.md#f-comercial-jhoel-app-src-app-core-utils-extract-error-message-ts), [index.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-index-ts)
- **Paquetes externos:** `@angular/common`, `@angular/core`
- **Consumidores:** [app.routes.ts](root.md#f-comercial-jhoel-app-src-app-app-routes-ts)
- **Plantilla:** [alert-settings-page.component.html](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.html) · **Usa componentes:** [page-header.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-page-header-page-header-component-ts), [icon.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-icon-icon-component-ts), [card.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-card-card-component-ts), [button.component.ts](shared-ui.md#f-comercial-jhoel-app-src-app-shared-ui-button-button-component-ts)
- **Eventos enlazados en la plantilla:** `(input)="onAlertDaysInput($any($event.target).value)"`, `(click)="saveAlertDays()"`, `(input)="onMinBalanceInput(type.id, $any($event.target).value)"`, `(click)="saveMinBalance(type.id)"`, `(input)="onBalanceLimitInput(type.id, $any($event.target).value)"`, `(click)="saveBalanceLimit(type.id)"`

#### Clase `AlertSettingsPageComponent` (L22–173)

- **Decoradores:** `@Component({ selector: 'app-alert-settings-page', standalone: true, imports: [ButtonComponent, CardComponent, IconComponent, PageHeaderComponent], templateUrl: '`
- **Propósito:** Admin-only screen for the DB-persisted alert thresholds: días de anticipación de pago (global, one row) and saldo mínimo per recharge type (Claro/Tigo, independently). Stock mínimo per producto+ubicación is deliberately NOT here — it already lives on each product's own detail page (`ProductDetailPageComponent`), right next to the stock it thresholds, so it isn't duplicated in a second place. Route itself is already `adminGuard`-gated in `app.routes.ts`; nothing here re-checks `AuthService.isAdmin` the way Categorías/Inventario do, matching the same "already unreachable for a non-admin" reasoning Usuarios/Roles use.
- **Servicios inyectados con `inject()`:** `alertSettingsService = inject(AlertSettingsService)`, `rechargesService = inject(RechargesService)`, `notificationService = inject(NotificationService)`
- **Datos / estado que administra:** `loading = signal(true)`, `rechargeTypes = signal<RechargeType[]>([])`, `alertDaysDraft = signal('')`, `isSavingAlertDays = signal(false)`, `minBalanceDraft = signal<Record<string, string>>({})`, `savingTypeId = signal<string \| null>(null)`, `balanceLimitDraft = signal<Record<string, string>>({})`, `savingLimitTypeId = signal<string \| null>(null)`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `fetchAll` | método private | 53–80 | — | `void` |
| `onAlertDaysInput` | método public | 82–84 | `value: string` | `void` |
| `canSaveAlertDays` | método public | 86–89 | — | `boolean` |
| `saveAlertDays` | método public | 91–108 | — | `void` |
| `onMinBalanceInput` | método public | 110–112 | `typeId: string`, `value: string` | `void` |
| `canSaveMinBalance` | método public | 114–121 | `typeId: string` | `boolean` |
| `saveMinBalance` | método public | 123–140 | `typeId: string` | `void` |
| `onBalanceLimitInput` | método public | 142–144 | `typeId: string`, `value: string` | `void` |
| `canSaveBalanceLimit` | método public | 146–153 | `typeId: string` | `boolean` |
| `saveBalanceLimit` | método public | 155–172 | `typeId: string` | `void` |

##### `AlertSettingsPageComponent.fetchAll`

- **Firma:** `fetchAll(): void` — [alert-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts#L53) (L53–80)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loading.set`, `this.alertSettingsService.getSettings().subscribe`, `this.alertSettingsService.getSettings`, `this.alertDaysDraft.set`, `String`, `this.notificationService.error`, `extractErrorMessage`, `this.rechargesService.getTypes().subscribe`, `this.rechargesService.getTypes`, `this.rechargeTypes.set`, `this.minBalanceDraft.set`, `Object.fromEntries`, `types.map`, `this.balanceLimitDraft.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.loading.set`, `this.alertDaysDraft.set`, `this.rechargeTypes.set`, `this.minBalanceDraft.set`, `this.balanceLimitDraft.set`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AlertSettingsPageComponent.onAlertDaysInput`

- **Firma:** `onAlertDaysInput(value: string): void` — [alert-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts#L82) (L82–84)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.alertDaysDraft.set`
- **Efectos secundarios:** Actualiza estado (signals): `this.alertDaysDraft.set`
- **Consumidores:** `alert-settings-page.component.html` (plantilla)

##### `AlertSettingsPageComponent.canSaveAlertDays`

- **Firma:** `canSaveAlertDays(): boolean` — [alert-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts#L86) (L86–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Number`, `this.alertDaysDraft`, `Number.isInteger`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `alert-settings-page.component.html` (plantilla), (mismo archivo)

##### `AlertSettingsPageComponent.saveAlertDays`

- **Firma:** `saveAlertDays(): void` — [alert-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts#L91) (L91–108)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSaveAlertDays`, `this.isSavingAlertDays`, `this.isSavingAlertDays.set`, `this.alertSettingsService.updateSettings`, `Number`, `this.alertDaysDraft`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.isSavingAlertDays.set`
- **Consumidores:** `alert-settings-page.component.html` (plantilla)

##### `AlertSettingsPageComponent.onMinBalanceInput`

- **Firma:** `onMinBalanceInput(typeId: string, value: string): void` — [alert-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts#L110) (L110–112)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.minBalanceDraft.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.minBalanceDraft.update`
- **Consumidores:** `alert-settings-page.component.html` (plantilla)

##### `AlertSettingsPageComponent.canSaveMinBalance`

- **Firma:** `canSaveMinBalance(typeId: string): boolean` — [alert-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts#L114) (L114–121)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.minBalanceDraft`, `Number`, `Number.isFinite`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `alert-settings-page.component.html` (plantilla), (mismo archivo)

##### `AlertSettingsPageComponent.saveMinBalance`

- **Firma:** `saveMinBalance(typeId: string): void` — [alert-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts#L123) (L123–140)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSaveMinBalance`, `this.savingTypeId`, `Number`, `this.minBalanceDraft`, `this.savingTypeId.set`, `this.rechargesService.updateTypeMinBalance(typeId, minBalance).subscribe`, `this.rechargesService.updateTypeMinBalance`, `this.rechargeTypes.update`, `types.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.savingTypeId.set`, `this.rechargeTypes.update`
- **Consumidores:** `alert-settings-page.component.html` (plantilla)

##### `AlertSettingsPageComponent.onBalanceLimitInput`

- **Firma:** `onBalanceLimitInput(typeId: string, value: string): void` — [alert-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts#L142) (L142–144)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.balanceLimitDraft.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.balanceLimitDraft.update`
- **Consumidores:** `alert-settings-page.component.html` (plantilla)

##### `AlertSettingsPageComponent.canSaveBalanceLimit`

- **Firma:** `canSaveBalanceLimit(typeId: string): boolean` — [alert-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts#L146) (L146–153)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.balanceLimitDraft`, `Number`, `Number.isFinite`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** `alert-settings-page.component.html` (plantilla), (mismo archivo)

##### `AlertSettingsPageComponent.saveBalanceLimit`

- **Firma:** `saveBalanceLimit(typeId: string): void` — [alert-settings-page.component.ts](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts#L155) (L155–172)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.canSaveBalanceLimit`, `this.savingLimitTypeId`, `Number`, `this.balanceLimitDraft`, `this.savingLimitTypeId.set`, `this.rechargesService.updateTypeBalanceLimit(typeId, balanceLimit).subscribe`, `this.rechargesService.updateTypeBalanceLimit`, `this.rechargeTypes.update`, `types.map`, `this.notificationService.success`, `this.notificationService.error`, `extractErrorMessage`
- **Efectos secundarios:** Actualiza estado (signals): `this.savingLimitTypeId.set`, `this.rechargeTypes.update`
- **Consumidores:** `alert-settings-page.component.html` (plantilla)

