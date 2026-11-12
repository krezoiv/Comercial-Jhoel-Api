# Módulo backend `alert-settings`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/alert-settings` | [alert-settings.controller.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/presentation/controllers/alert-settings.controller.ts#L27) `AlertSettingsController.get` | [GetAlertSettingsUseCase](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-ts) | `AlertSettingsRepository`.get | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AlertSettingsService.getSettings` |
| `PATCH /api/alert-settings` | [alert-settings.controller.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/presentation/controllers/alert-settings.controller.ts#L32) `AlertSettingsController.update` | [UpdateAlertSettingsUseCase](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-ts) | `AlertSettingsRepository`.update | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `AlertSettingsService.updateSettings` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [alert-settings.module.ts](#f-comercial-jhoel-api-src-modules-alert-settings-alert-settings-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `AlertSettingsModule` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm | 2 | Baja (2 consumidores) |
| [alert-settings-output.ts](#f-comercial-jhoel-api-src-modules-alert-settings-application-dtos-alert-settings-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toAlertSettingsOutput`, `AlertSettingsOutput` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [get-alert-settings.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria (sin comentario de documentación en el código). | 3 internas | 0 | Soporte (pruebas) |
| [get-alert-settings.use-case.ts](#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetAlertSettingsUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [update-alert-settings.use-case.spec.ts](#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `makeSettings` (sin comentario de documentación en el código). | 4 internas | 0 | Soporte (pruebas) |
| [update-alert-settings.use-case.ts](#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateAlertSettingsUseCase`, `UpdateAlertSettingsInput` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [alert-settings.entity.ts](#f-comercial-jhoel-api-src-modules-alert-settings-domain-entities-alert-settings-entity-ts) | .ts | Entidad de dominio | Dominio | A genuine singleton — exactly one row always exists (seeded by migration `1760000300000-CreateAlertSettings`). | 0 internas | 7 | Media (7 consumidores) |
| [invalid-alert-settings.error.ts](#f-comercial-jhoel-api-src-modules-alert-settings-domain-errors-invalid-alert-settings-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `InvalidAlertSettingsError` (sin comentario de documentación en el código). | 1 internas | 2 | Baja (2 consumidores) |
| [alert-settings.repository.ts](#f-comercial-jhoel-api-src-modules-alert-settings-domain-repositories-alert-settings-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `UpdateAlertSettingsData`, `AlertSettingsRepository`, `ALERT_SETTINGS_REPOSITORY` (sin comentario de documentación en el código). | 1 internas | 8 | Media (8 consumidores) |
| [alert-settings.mapper.ts](#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `AlertSettingsMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [alert-settings.orm-entity.ts](#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `AlertSettingsOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-alert-settings.repository.ts](#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-typeorm-alert-settings-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmAlertSettingsRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [alert-settings.controller.ts](#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts) | .ts | Controlador | Presentación | "Configuración de Alertas" — admin-only end to end (class-level `@Roles`), unlike the alerts themselves (`GET /alerts` is open to any authenticated account — seeing your own low-stock/payment-due alerts is operational; changing the threshold everyone alerts against is a management decision). | 8 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [alert-settings.response.dto.ts](#f-comercial-jhoel-api-src-modules-alert-settings-presentation-dtos-alert-settings-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `AlertSettingsResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [update-alert-settings.request.dto.ts](#f-comercial-jhoel-api-src-modules-alert-settings-presentation-dtos-update-alert-settings-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateAlertSettingsRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-alert-settings-alert-settings-module-ts"></a>

### alert-settings.module.ts

- **Ruta:** [alert-settings.module.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/alert-settings.module.ts) (`comercial-jhoel-api/src/modules/alert-settings/alert-settings.module.ts`, 25 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** Módulo: declara `AlertSettingsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [alert-settings.orm-entity.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-orm-entity-ts), [typeorm-alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-typeorm-alert-settings-repository-ts), [alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-repositories-alert-settings-repository-ts), [get-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-ts), [update-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-ts), [alert-settings.controller.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [alerts.module.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-alerts-module-ts)

#### Clase `AlertSettingsModule` (L10–24)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([AlertSettingsOrmEntity])], controllers: [AlertSettingsController], providers: [ { provide: ALERT_SETTINGS_REPOSITOR`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-alert-settings-application-dtos-alert-settings-output-ts"></a>

### alert-settings-output.ts

- **Ruta:** [alert-settings-output.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/application/dtos/alert-settings-output.ts) (`comercial-jhoel-api/src/modules/alert-settings/application/dtos/alert-settings-output.ts`, 18 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** DTO de salida (aplicación): declara `toAlertSettingsOutput`, `AlertSettingsOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [alert-settings.entity.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-entities-alert-settings-entity-ts)
- **Consumidores:** [get-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-ts), [update-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-ts)

**Interfaces, tipos y enums:**

- `interface AlertSettingsOutput` (L3): sin documentación — miembros: `purchasePaymentAlertDays`, `updatedAt`, `updatedByUsername`
#### Función `toAlertSettingsOutput` (L9–17)

- **Tipo:** función exportada
- **Firma:** `toAlertSettingsOutput(settings: AlertSettings): AlertSettingsOutput` — [alert-settings-output.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/application/dtos/alert-settings-output.ts#L9)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-ts), [update-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-spec-ts"></a>

### get-alert-settings.use-case.spec.ts

- **Ruta:** [get-alert-settings.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/application/use-cases/get-alert-settings.use-case.spec.ts) (`comercial-jhoel-api/src/modules/alert-settings/application/use-cases/get-alert-settings.use-case.spec.ts`, 26 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** Prueba unitaria (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [get-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-ts), [alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-repositories-alert-settings-repository-ts), [alert-settings.entity.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-entities-alert-settings-entity-ts)
- **Consumidores:** —
<a id="f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-ts"></a>

### get-alert-settings.use-case.ts

- **Ruta:** [get-alert-settings.use-case.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/application/use-cases/get-alert-settings.use-case.ts) (`comercial-jhoel-api/src/modules/alert-settings/application/use-cases/get-alert-settings.use-case.ts`, 21 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** Caso de uso: declara `GetAlertSettingsUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-repositories-alert-settings-repository-ts), [alert-settings-output.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-dtos-alert-settings-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [alert-settings.module.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-alert-settings-module-ts), [get-alert-settings.use-case.spec.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-spec-ts), [alert-settings.controller.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts)

#### Clase `GetAlertSettingsUseCase` (L9–20)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ALERT_SETTINGS_REPOSITORY) alertSettingsRepository: AlertSettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 16–19 | — | `Promise<AlertSettingsOutput>` |

##### `GetAlertSettingsUseCase.execute`

- **Firma:** `execute(): Promise<AlertSettingsOutput>` — [get-alert-settings.use-case.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/application/use-cases/get-alert-settings.use-case.ts#L16) (L16–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.alertSettingsRepository.get`, `toAlertSettingsOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [alert-settings.controller.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-spec-ts"></a>

### update-alert-settings.use-case.spec.ts

- **Ruta:** [update-alert-settings.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/application/use-cases/update-alert-settings.use-case.spec.ts) (`comercial-jhoel-api/src/modules/alert-settings/application/use-cases/update-alert-settings.use-case.spec.ts`, 67 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** Prueba unitaria: declara `makeSettings` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [update-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-ts), [alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-repositories-alert-settings-repository-ts), [invalid-alert-settings.error.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-errors-invalid-alert-settings-error-ts), [alert-settings.entity.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-entities-alert-settings-entity-ts)
- **Consumidores:** —
#### Función `makeSettings` (L6–14)

- **Tipo:** función local del archivo
- **Firma:** `makeSettings(purchasePaymentAlertDays: number): AlertSettings` — [update-alert-settings.use-case.spec.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/application/use-cases/update-alert-settings.use-case.spec.ts#L6)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `AlertSettings.create`, `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-ts"></a>

### update-alert-settings.use-case.ts

- **Ruta:** [update-alert-settings.use-case.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/application/use-cases/update-alert-settings.use-case.ts) (`comercial-jhoel-api/src/modules/alert-settings/application/use-cases/update-alert-settings.use-case.ts`, 39 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** Caso de uso: declara `UpdateAlertSettingsUseCase`, `UpdateAlertSettingsInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-repositories-alert-settings-repository-ts), [invalid-alert-settings.error.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-errors-invalid-alert-settings-error-ts), [alert-settings-output.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-dtos-alert-settings-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [alert-settings.module.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-alert-settings-module-ts), [update-alert-settings.use-case.spec.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-spec-ts), [alert-settings.controller.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateAlertSettingsInput` (L10): sin documentación — miembros: `purchasePaymentAlertDays`, `updatedBy`

#### Clase `UpdateAlertSettingsUseCase` (L15–38)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(ALERT_SETTINGS_REPOSITORY) alertSettingsRepository: AlertSettingsRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 22–37 | `input: UpdateAlertSettingsInput` | `Promise<AlertSettingsOutput>` |

##### `UpdateAlertSettingsUseCase.execute`

- **Firma:** `execute(input: UpdateAlertSettingsInput): Promise<AlertSettingsOutput>` — [update-alert-settings.use-case.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/application/use-cases/update-alert-settings.use-case.ts#L22) (L22–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `Number.isInteger`, `new InvalidAlertSettingsError`, `this.alertSettingsRepository.update`, `toAlertSettingsOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.alertSettingsRepository.update`
- **Errores que lanza:** `new InvalidAlertSettingsError( 'Los días de anticipación deben ser un número entero mayor o igual a cero.', )`
- **Consumidores:** [alert-settings.controller.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-alert-settings-domain-entities-alert-settings-entity-ts"></a>

### alert-settings.entity.ts

- **Ruta:** [alert-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/domain/entities/alert-settings.entity.ts) (`comercial-jhoel-api/src/modules/alert-settings/domain/entities/alert-settings.entity.ts`, 37 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** A genuine singleton — exactly one row always exists (seeded by migration `1760000300000-CreateAlertSettings`).
- **Consumidores:** [alert-settings-output.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-dtos-alert-settings-output-ts), [get-alert-settings.use-case.spec.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-spec-ts), [update-alert-settings.use-case.spec.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-spec-ts), [alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-repositories-alert-settings-repository-ts), [alert-settings.mapper.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-mapper-ts), [typeorm-alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-typeorm-alert-settings-repository-ts), [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts)

**Interfaces, tipos y enums:**

- `interface AlertSettingsProps` (L1): sin documentación — miembros: `id`, `purchasePaymentAlertDays`, `updatedAt`, `updatedBy`, `updatedByUsername`

#### Clase `AlertSettings` (L10–36)

- **Propósito:** A genuine singleton — exactly one row always exists (seeded by migration `1760000300000-CreateAlertSettings`). Holds the one truly-global alert threshold (`purchasePaymentAlertDays`); per-entity thresholds (`inventory_stock.min_stock`, `recharge_types.min_balance`) live on their own owning tables instead — see that migration's own doc comment.
- **Dependencias inyectadas (constructor):** `props: AlertSettingsProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 13–15 | `props: AlertSettingsProps` | `AlertSettings` |
| `id` | getter public | 17–19 | — | `string` |
| `purchasePaymentAlertDays` | getter public | 21–23 | — | `number` |
| `updatedAt` | getter public | 25–27 | — | `Date` |
| `updatedBy` | getter public | 29–31 | — | `string \| null` |
| `updatedByUsername` | getter public | 33–35 | — | `string \| null` |

##### `AlertSettings.create`

- **Firma:** `create(props: AlertSettingsProps): AlertSettings` — [alert-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/domain/entities/alert-settings.entity.ts#L13) (L13–15)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new AlertSettings`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [update-alert-settings.use-case.spec.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-spec-ts), [alert-settings.mapper.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-mapper-ts), [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts)

##### `AlertSettings.id`

- **Firma:** `id(): string` — [alert-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/domain/entities/alert-settings.entity.ts#L17) (L17–19)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AlertSettings.purchasePaymentAlertDays`

- **Firma:** `purchasePaymentAlertDays(): number` — [alert-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/domain/entities/alert-settings.entity.ts#L21) (L21–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AlertSettings.updatedAt`

- **Firma:** `updatedAt(): Date` — [alert-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/domain/entities/alert-settings.entity.ts#L25) (L25–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AlertSettings.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [alert-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/domain/entities/alert-settings.entity.ts#L29) (L29–31)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AlertSettings.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [alert-settings.entity.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/domain/entities/alert-settings.entity.ts#L33) (L33–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-alert-settings-domain-errors-invalid-alert-settings-error-ts"></a>

### invalid-alert-settings.error.ts

- **Ruta:** [invalid-alert-settings.error.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/domain/errors/invalid-alert-settings.error.ts) (`comercial-jhoel-api/src/modules/alert-settings/domain/errors/invalid-alert-settings.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** Errores de dominio: declara `InvalidAlertSettingsError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [update-alert-settings.use-case.spec.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-spec-ts), [update-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-ts)

#### Clase `InvalidAlertSettingsError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `message: string`
<a id="f-comercial-jhoel-api-src-modules-alert-settings-domain-repositories-alert-settings-repository-ts"></a>

### alert-settings.repository.ts

- **Ruta:** [alert-settings.repository.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/domain/repositories/alert-settings.repository.ts) (`comercial-jhoel-api/src/modules/alert-settings/domain/repositories/alert-settings.repository.ts`, 15 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `UpdateAlertSettingsData`, `AlertSettingsRepository`, `ALERT_SETTINGS_REPOSITORY` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [alert-settings.entity.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-entities-alert-settings-entity-ts)
- **Consumidores:** [alert-settings.module.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-alert-settings-module-ts), [get-alert-settings.use-case.spec.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-spec-ts), [get-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-ts), [update-alert-settings.use-case.spec.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-spec-ts), [update-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-ts), [typeorm-alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-typeorm-alert-settings-repository-ts), [get-alerts.use-case.spec.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-spec-ts), [get-alerts.use-case.ts](alerts.md#f-comercial-jhoel-api-src-modules-alerts-application-use-cases-get-alerts-use-case-ts)

**Interfaces, tipos y enums:**

- `interface UpdateAlertSettingsData` (L5): sin documentación — miembros: `purchasePaymentAlertDays`, `updatedBy`
- `interface AlertSettingsRepository` (L10): sin documentación — miembros: `get`, `update`

**Constantes exportadas:**

- `ALERT_SETTINGS_REPOSITORY` (L3) = `Symbol('ALERT_SETTINGS_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-mapper-ts"></a>

### alert-settings.mapper.ts

- **Ruta:** [alert-settings.mapper.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/infrastructure/persistence/alert-settings.mapper.ts) (`comercial-jhoel-api/src/modules/alert-settings/infrastructure/persistence/alert-settings.mapper.ts`, 15 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** Mapper: declara `AlertSettingsMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [alert-settings.entity.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-entities-alert-settings-entity-ts), [alert-settings.orm-entity.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-orm-entity-ts)
- **Consumidores:** [typeorm-alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-typeorm-alert-settings-repository-ts)

#### Clase `AlertSettingsMapper` (L4–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–13 | `orm: AlertSettingsOrmEntity` | `AlertSettings` |

##### `AlertSettingsMapper.toDomain`

- **Firma:** `toDomain(orm: AlertSettingsOrmEntity): AlertSettings` — [alert-settings.mapper.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/infrastructure/persistence/alert-settings.mapper.ts#L5) (L5–13)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `AlertSettings.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-typeorm-alert-settings-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-orm-entity-ts"></a>

### alert-settings.orm-entity.ts

- **Ruta:** [alert-settings.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/infrastructure/persistence/alert-settings.orm-entity.ts) (`comercial-jhoel-api/src/modules/alert-settings/infrastructure/persistence/alert-settings.orm-entity.ts`, 33 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `AlertSettingsOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [alert-settings.module.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-alert-settings-module-ts), [alert-settings.mapper.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-mapper-ts), [typeorm-alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-typeorm-alert-settings-repository-ts)

#### Clase `AlertSettingsOrmEntity` (L11–32)

- **Decoradores:** `@Entity('alert_settings')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column purchasePaymentAlertDays: number`, `@UpdateDateColumn updatedAt: Date`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-typeorm-alert-settings-repository-ts"></a>

### typeorm-alert-settings.repository.ts

- **Ruta:** [typeorm-alert-settings.repository.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/infrastructure/persistence/typeorm-alert-settings.repository.ts) (`comercial-jhoel-api/src/modules/alert-settings/infrastructure/persistence/typeorm-alert-settings.repository.ts`, 42 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmAlertSettingsRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [alert-settings.entity.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-entities-alert-settings-entity-ts), [alert-settings.repository.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-domain-repositories-alert-settings-repository-ts), [alert-settings.orm-entity.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-orm-entity-ts), [alert-settings.mapper.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-infrastructure-persistence-alert-settings-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [alert-settings.module.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-alert-settings-module-ts)

#### Clase `TypeOrmAlertSettingsRepository` (L12–41)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements AlertSettingsRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(AlertSettingsOrmEntity) repository: Repository<AlertSettingsOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `get` | método public async | 19–28 | — | `Promise<AlertSettings>` |
| `update` | método public async | 30–40 | `data: UpdateAlertSettingsData` | `Promise<AlertSettings>` |

##### `TypeOrmAlertSettingsRepository.get`

- **Firma:** `get(): Promise<AlertSettings>` — [typeorm-alert-settings.repository.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/infrastructure/persistence/typeorm-alert-settings.repository.ts#L19) (L19–28)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `new InternalServerErrorException`, `AlertSettingsMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InternalServerErrorException( 'No se encontró la configuración de alertas.', )`
- **Consumidores:** (mismo archivo)

##### `TypeOrmAlertSettingsRepository.update`

- **Firma:** `update(data: UpdateAlertSettingsData): Promise<AlertSettings>` — [typeorm-alert-settings.repository.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/infrastructure/persistence/typeorm-alert-settings.repository.ts#L30) (L30–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.get`, `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts"></a>

### alert-settings.controller.ts

- **Ruta:** [alert-settings.controller.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/presentation/controllers/alert-settings.controller.ts) (`comercial-jhoel-api/src/modules/alert-settings/presentation/controllers/alert-settings.controller.ts`, 43 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** "Configuración de Alertas" — admin-only end to end (class-level `@Roles`), unlike the alerts themselves (`GET /alerts` is open to any authenticated account — seeing your own low-stock/payment-due alerts is operational; changing the threshold everyone alerts against is a management decision).
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [get-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-get-alert-settings-use-case-ts), [update-alert-settings.use-case.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-application-use-cases-update-alert-settings-use-case-ts), [update-alert-settings.request.dto.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-dtos-update-alert-settings-request-dto-ts), [alert-settings.response.dto.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-dtos-alert-settings-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [alert-settings.module.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-alert-settings-module-ts)

#### Clase `AlertSettingsController` (L18–42)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('alert-settings')`
- **Propósito:** "Configuración de Alertas" — admin-only end to end (class-level `@Roles`), unlike the alerts themselves (`GET /alerts` is open to any authenticated account — seeing your own low-stock/payment-due alerts is operational; changing the threshold everyone alerts against is a management decision).
- **Dependencias inyectadas (constructor):** `getAlertSettingsUseCase: GetAlertSettingsUseCase`, `updateAlertSettingsUseCase: UpdateAlertSettingsUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `get` | método public | 27–30 | — | `Promise<AlertSettingsResponseDto>` |
| `update` | método public | 32–41 | `dto: UpdateAlertSettingsRequestDto`, `userId: string` | `Promise<AlertSettingsResponseDto>` |

##### `AlertSettingsController.get`

- **Firma:** `get(): Promise<AlertSettingsResponseDto>` — [alert-settings.controller.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/presentation/controllers/alert-settings.controller.ts#L27) (L27–30)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.getAlertSettingsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `AlertSettingsController.update`

- **Firma:** `update(dto: UpdateAlertSettingsRequestDto, userId: string): Promise<AlertSettingsResponseDto>` — [alert-settings.controller.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/presentation/controllers/alert-settings.controller.ts#L32) (L32–41)
- **Decoradores:** `@Patch()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateAlertSettingsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-alert-settings-presentation-dtos-alert-settings-response-dto-ts"></a>

### alert-settings.response.dto.ts

- **Ruta:** [alert-settings.response.dto.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/presentation/dtos/alert-settings.response.dto.ts) (`comercial-jhoel-api/src/modules/alert-settings/presentation/dtos/alert-settings.response.dto.ts`, 6 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** DTO de respuesta: declara `AlertSettingsResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [alert-settings.controller.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts)

#### Clase `AlertSettingsResponseDto` (L1–5)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-alert-settings-presentation-dtos-update-alert-settings-request-dto-ts"></a>

### update-alert-settings.request.dto.ts

- **Ruta:** [update-alert-settings.request.dto.ts](../../../../comercial-jhoel-api/src/modules/alert-settings/presentation/dtos/update-alert-settings.request.dto.ts) (`comercial-jhoel-api/src/modules/alert-settings/presentation/dtos/update-alert-settings.request.dto.ts`, 8 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `alert-settings`
- **Responsabilidad:** DTO de entrada: declara `UpdateAlertSettingsRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [alert-settings.controller.ts](alert-settings.md#f-comercial-jhoel-api-src-modules-alert-settings-presentation-controllers-alert-settings-controller-ts)

#### Clase `UpdateAlertSettingsRequestDto` (L3–7)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
