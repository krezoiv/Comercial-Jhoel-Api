# Módulo backend `financial-day-review`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/financial-day-reviews/days` | [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L61) `FinancialDayReviewController.days` | [ListFinancialDaysUseCase](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts) | `FinancialDayReviewRepository`.listDays [day_openings, cash_operational_days, bank_balances, agent_reconciliations, bank_account_movements, bank_deposit_operations] | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') | `FinancialDayReviewService.listDays` |
| `GET /api/financial-day-reviews/days/:date` | [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L69) `FinancialDayReviewController.day` | [GetFinancialDayReviewUseCase](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts) | `FinancialDayReviewRepository`.getDayData/listSessions/listCorrections [financial_day_corrections, users] | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') | `FinancialDayReviewService.getDay` |
| `GET /api/financial-day-reviews/corrections` | [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L74) `FinancialDayReviewController.corrections` | [ListFinancialDayCorrectionsUseCase](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts) | `FinancialDayReviewRepository`.listCorrections [financial_day_corrections, users] | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') | `FinancialDayReviewService.listCorrections` |
| `POST /api/financial-day-reviews/sessions` | [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L82) `FinancialDayReviewController.open` | [OpenFinancialDayReviewUseCase](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts) | `FinancialDayReviewRepository`.openSession/findSessionById → `open_financial_day_review` [financial_day_review_sessions] | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') Roles('SUPER_ADMIN') | `FinancialDayReviewService.openReview` |
| `GET /api/financial-day-reviews/sessions/:id` | [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L97) `FinancialDayReviewController.session` | [GetFinancialDayReviewSessionUseCase](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts) | `FinancialDayReviewRepository`.findSessionById | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') | — |
| `POST /api/financial-day-reviews/sessions/:id/snapshot-corrections` | [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L105) `FinancialDayReviewController.snapshot` | [CorrectFinancialDaySnapshotUseCase](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts) | `FinancialDayReviewRepository`.correctSnapshot → `correct_financial_day_snapshot` | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') Roles('SUPER_ADMIN') | `FinancialDayReviewService.correctSnapshot` |
| `POST /api/financial-day-reviews/sessions/:id/movement-adjustments` | [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L127) `FinancialDayReviewController.movement` | [AdjustFinancialDayMovementUseCase](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts) | `FinancialDayReviewRepository`.adjustMovement → `adjust_financial_day_movement` | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') Roles('SUPER_ADMIN') | `FinancialDayReviewService.adjustMovement` |
| `POST /api/financial-day-reviews/sessions/:id/close-request` | [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L148) `FinancialDayReviewController.closeRequest` | [RequestFinancialDayReviewCloseUseCase](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts) | `FinancialDayReviewRepository`.requestClose/findSessionById/listCorrections/getDayData → `request_financial_day_review_close` [financial_day_corrections, users] | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') Roles('SUPER_ADMIN') | `FinancialDayReviewService.requestClose` |
| `POST /api/financial-day-reviews/sessions/:id/close` | [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L162) `FinancialDayReviewController.close` | [CloseFinancialDayReviewUseCase](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts) | `FinancialDayReviewRepository`.closeSession/findSessionById → `close_financial_day_review` [financial_day_review_sessions] | UseGuards(JwtAuthGuard, RolesGuard) Roles('SUPER_ADMIN', 'ADMIN') Roles('SUPER_ADMIN') | `FinancialDayReviewService.close` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [financial-day-review.use-cases.spec.ts](#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-spec-ts) | .ts | Prueba unitaria | Aplicación | Prueba unitaria: declara `correction`, `repository`, `expectCode`, `SUPER`, `ADMIN` (sin comentario de documentación en el código). | 4 internas | 0 | Soporte (pruebas) |
| [financial-day-review.use-cases.ts](#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts) | .ts | Caso de uso | Aplicación | Calendar/table of operational days with cheap per-day indicators. | 4 internas; ext.: @nestjs/common | 3 | Media (3 consumidores) |
| [financial-day-review.errors.ts](#f-comercial-jhoel-api-src-modules-financial-day-review-domain-errors-financial-day-review-errors-ts) | .ts | Errores de dominio | Dominio | Business-rule violation of "Revisión de días operativos". | 1 internas | 4 | Media (4 consumidores) |
| [financial-day-permissions.ts](#f-comercial-jhoel-api-src-modules-financial-day-review-domain-financial-day-permissions-ts) | .ts | Código TypeScript | Dominio | Permissions of "Revisión de días operativos". | 0 internas | 2 | Baja (2 consumidores) |
| [financial-day-review.repository.ts](#f-comercial-jhoel-api-src-modules-financial-day-review-domain-repositories-financial-day-review-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Port of "Revisión de días operativos". | 0 internas | 7 | Media (7 consumidores) |
| [financial-day-diagnostics.spec.ts](#f-comercial-jhoel-api-src-modules-financial-day-review-domain-services-financial-day-diagnostics-spec-ts) | .ts | Prueba unitaria | Dominio | Prueba unitaria: declara `emptyPortfolio`, `baseDay`, `DAY`, `BANK`, `CLIENT` (sin comentario de documentación en el código). | 2 internas | 0 | Soporte (pruebas) |
| [financial-day-diagnostics.ts](#f-comercial-jhoel-api-src-modules-financial-day-review-domain-services-financial-day-diagnostics-ts) | .ts | Código TypeScript | Dominio | Rounds to cents (avoids binary float noise in every sum). | 1 internas | 2 | Baja (2 consumidores) |
| [financial-day-review.module.ts](#f-comercial-jhoel-api-src-modules-financial-day-review-financial-day-review-module-ts) | .ts | Módulo | Arranque / configuración | "Revisión de días operativos" — audited review mode for one past operational day (diagnosis, isolated corrections, close). | 4 internas; ext.: @nestjs/common | 1 | Baja (1 consumidores) |
| [typeorm-financial-day-review.repository.ts](#f-comercial-jhoel-api-src-modules-financial-day-review-infrastructure-persistence-typeorm-financial-day-review-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Raw-SQL adapter of "Revisión de días operativos". | 2 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [financial-day-review.controller.ts](#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts) | .ts | Controlador | Presentación | Sistema → Administración financiera → Revisión de días operativos. | 6 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [financial-day-review.request.dto.ts](#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-dtos-financial-day-review-request-dto-ts) | .ts | DTO de entrada | Presentación | Calendar range (inclusive, ISO dates). | 1 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-spec-ts"></a>

### financial-day-review.use-cases.spec.ts

- **Ruta:** [financial-day-review.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.spec.ts) (`comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.spec.ts`, 307 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Aplicación · **Módulo:** Módulo backend `financial-day-review`
- **Responsabilidad:** Prueba unitaria: declara `correction`, `repository`, `expectCode`, `SUPER`, `ADMIN` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-repositories-financial-day-review-repository-ts), [financial-day-review.errors.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-errors-financial-day-review-errors-ts), [financial-day-permissions.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-financial-day-permissions-ts), [financial-day-review.use-cases.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts)
- **Consumidores:** —
#### Función `correction` (L59–82)

- **Tipo:** función local del archivo
- **Firma:** `correction(id: string, module: CorrectionRow['module'], targetId?): CorrectionRow` — [financial-day-review.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.spec.ts#L59)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `repository` (L84–103)

- **Tipo:** función local del archivo
- **Firma:** `repository(): jest.Mocked<FinancialDayReviewRepository>` — [financial-day-review.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.spec.ts#L84)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `jest.fn().mockResolvedValue`, `jest.fn`, `correction`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `expectCode` (L105–110)

- **Tipo:** función local del archivo, async
- **Firma:** `expectCode(promise: Promise<unknown>, code: string)` — [financial-day-review.use-cases.spec.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.spec.ts#L105)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `expect(promise).rejects.toBeInstanceOf`, `expect`, `promise.catch`, `expect(error.code).toBe`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts"></a>

### financial-day-review.use-cases.ts

- **Ruta:** [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts) (`comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts`, 396 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `financial-day-review`
- **Responsabilidad:** Calendar/table of operational days with cheap per-day indicators.
- **Depende de (archivos del proyecto):** [financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-repositories-financial-day-review-repository-ts), [financial-day-permissions.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-financial-day-permissions-ts), [financial-day-review.errors.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-errors-financial-day-review-errors-ts), [financial-day-diagnostics.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-services-financial-day-diagnostics-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [financial-day-review.use-cases.spec.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-spec-ts), [financial-day-review.module.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-financial-day-review-module-ts), [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)

**Interfaces, tipos y enums:**

- `interface ReviewActor` (L45): Who is asking (from the JWT), re-checked by every use case. — miembros: `userId`, `role`
- `interface FinancialDayDetailOutput` (L50): sin documentación — miembros: `date`, `diagnosis`, `activeSession`, `sessions`, `corrections`, `permissions`
- `interface CloseSummaryOutput` (L63): sin documentación — miembros: `session`, `totalCorrections`, `byModule`, `banksModified`, `cashCorrections`, `receivableCorrections`, `assetCorrections`, `differenceBefore`, `differenceAfter`, `hasPendingDifferences`, `pendingDifferences`

#### Clase `ListFinancialDaysUseCase` (L78–99)

- **Decoradores:** `@Injectable()`
- **Propósito:** Calendar/table of operational days with cheap per-day indicators.
- **Dependencias inyectadas (constructor):** `@Inject(FINANCIAL_DAY_REVIEW_REPOSITORY) repository: FinancialDayReviewRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 85–98 | `input: { from: string; to: string; role: string; }` | `Promise<FinancialDayListRow[]>` |

##### `ListFinancialDaysUseCase.execute`

- **Firma:** `execute(input: { from: string; to: string; role: string; }): Promise<FinancialDayListRow[]>` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L85) (L85–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertPermission`, `assertDate`, `Date.parse`, `financialDayReviewError`, `this.repository.listDays`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `financialDayReviewError('FINANCIAL_REVIEW_INVALID_DATE')`
- **Consumidores:** [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)


#### Clase `GetFinancialDayReviewUseCase` (L102–137)

- **Decoradores:** `@Injectable()`
- **Propósito:** Everything about one day: full diagnosis, review sessions and audit trail.
- **Dependencias inyectadas (constructor):** `@Inject(FINANCIAL_DAY_REVIEW_REPOSITORY) repository: FinancialDayReviewRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 109–136 | `input: { date: string } & ReviewActor` | `Promise<FinancialDayDetailOutput>` |

##### `GetFinancialDayReviewUseCase.execute`

- **Firma:** `execute(input: { date: string } & ReviewActor): Promise<FinancialDayDetailOutput>` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L109) (L109–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertPermission`, `assertDate`, `Promise.all`, `this.repository.getDayData`, `this.repository.listSessions`, `this.repository.listCorrections`, `sessions.find`, `diagnoseFinancialDay`, `hasFinancialDayPermission`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)


#### Clase `OpenFinancialDayReviewUseCase` (L140–167)

- **Decoradores:** `@Injectable()`
- **Propósito:** Opens a closed past day in review mode (creates the session; changes no data).
- **Dependencias inyectadas (constructor):** `@Inject(FINANCIAL_DAY_REVIEW_REPOSITORY) repository: FinancialDayReviewRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 147–166 | `input: { date: string; reason: string } & ReviewActor` | `Promise<ReviewSessionRow>` |

##### `OpenFinancialDayReviewUseCase.execute`

- **Firma:** `execute(input: { date: string; reason: string } & ReviewActor): Promise<ReviewSessionRow>` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L147) (L147–166)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertPermission`, `assertDate`, `input.reason.trim`, `financialDayReviewError`, `this.repository.openSession`, `this.repository.findSessionById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `financialDayReviewError('FINANCIAL_REVIEW_REASON_REQUIRED')`, `financialDayReviewError('FINANCIAL_REVIEW_SESSION_NOT_FOUND')`
- **Consumidores:** [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)


#### Clase `CorrectFinancialDaySnapshotUseCase` (L170–211)

- **Decoradores:** `@Injectable()`
- **Propósito:** Corrects a day-owned snapshot value in place (versioned + audited).
- **Dependencias inyectadas (constructor):** `@Inject(FINANCIAL_DAY_REVIEW_REPOSITORY) repository: FinancialDayReviewRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 177–210 | `input: { sessionId: string; target: string; targetId: string; field: string; newValue: number; reason: string; observations?: string \| null; requestId: string; } & Rev` | `Promise<CorrectionRow>` |

##### `CorrectFinancialDaySnapshotUseCase.execute`

- **Firma:** `execute(input: { sessionId: string; target: string; targetId: string; field: string; newValue: number; reason: string; observations?: string \| null; requestId: string; } & Rev): Promise<CorrectionRow>` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L177) (L177–210)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertPermission`, `financialDayReviewError`, `fields.includes`, `this.repository.correctSnapshot`, `findCorrection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `financialDayReviewError('FINANCIAL_REVIEW_INVALID_TARGET')`, `financialDayReviewError('FINANCIAL_REVIEW_INVALID_FIELD')`
- **Consumidores:** [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)


#### Clase `AdjustFinancialDayMovementUseCase` (L214–248)

- **Decoradores:** `@Injectable()`
- **Propósito:** Corrects a ledger movement through a linked adjustment (the ledger is never edited).
- **Dependencias inyectadas (constructor):** `@Inject(FINANCIAL_DAY_REVIEW_REPOSITORY) repository: FinancialDayReviewRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 221–247 | `input: { sessionId: string; source: string; sourceId: string; correctedAmount: number; reason: string; observations?: string \| null; requestId: string; } & ReviewActor` | `Promise<CorrectionRow>` |

##### `AdjustFinancialDayMovementUseCase.execute`

- **Firma:** `execute(input: { sessionId: string; source: string; sourceId: string; correctedAmount: number; reason: string; observations?: string \| null; requestId: string; } & ReviewActor): Promise<CorrectionRow>` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L221) (L221–247)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertPermission`, `(MOVEMENT_SOURCES as readonly string[]).includes`, `financialDayReviewError`, `this.repository.adjustMovement`, `findCorrection`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `financialDayReviewError('FINANCIAL_REVIEW_INVALID_TARGET')`
- **Consumidores:** [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)


#### Clase `RequestFinancialDayReviewCloseUseCase` (L295–317)

- **Decoradores:** `@Injectable()`
- **Propósito:** Moves the session to PENDING_CONFIRMATION and returns the close summary.
- **Dependencias inyectadas (constructor):** `@Inject(FINANCIAL_DAY_REVIEW_REPOSITORY) repository: FinancialDayReviewRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 302–316 | `input: { sessionId: string } & ReviewActor` | `Promise<CloseSummaryOutput>` |

##### `RequestFinancialDayReviewCloseUseCase.execute`

- **Firma:** `execute(input: { sessionId: string } & ReviewActor): Promise<CloseSummaryOutput>` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L302) (L302–316)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertPermission`, `this.repository.requestClose`, `this.repository.findSessionById`, `financialDayReviewError`, `Promise.all`, `this.repository.listCorrections`, `this.repository.getDayData`, `buildCloseSummary`, `diagnoseFinancialDay`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `financialDayReviewError('FINANCIAL_REVIEW_SESSION_NOT_FOUND')`
- **Consumidores:** [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)


#### Clase `CloseFinancialDayReviewUseCase` (L320–350)

- **Decoradores:** `@Injectable()`
- **Propósito:** Closes the review (stores the corrected photograph; other days untouched).
- **Dependencias inyectadas (constructor):** `@Inject(FINANCIAL_DAY_REVIEW_REPOSITORY) repository: FinancialDayReviewRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 327–349 | `input: { sessionId: string; observations?: string \| null; acceptPendingDifferences: boolean; } & ReviewActor` | `Promise<ReviewSessionRow>` |

##### `CloseFinancialDayReviewUseCase.execute`

- **Firma:** `execute(input: { sessionId: string; observations?: string \| null; acceptPendingDifferences: boolean; } & ReviewActor): Promise<ReviewSessionRow>` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L327) (L327–349)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertPermission`, `this.repository.closeSession`, `this.repository.findSessionById`, `financialDayReviewError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `financialDayReviewError('FINANCIAL_REVIEW_SESSION_NOT_FOUND')`
- **Consumidores:** [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)


#### Clase `ListFinancialDayCorrectionsUseCase` (L353–374)

- **Decoradores:** `@Injectable()`
- **Propósito:** Audit trail of corrections (by day or by session).
- **Dependencias inyectadas (constructor):** `@Inject(FINANCIAL_DAY_REVIEW_REPOSITORY) repository: FinancialDayReviewRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 360–373 | `input: { date?: string; sessionId?: string; role: string; }` | `Promise<CorrectionRow[]>` |

##### `ListFinancialDayCorrectionsUseCase.execute`

- **Firma:** `execute(input: { date?: string; sessionId?: string; role: string; }): Promise<CorrectionRow[]>` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L360) (L360–373)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertPermission`, `assertDate`, `this.repository.listCorrections`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)


#### Clase `GetFinancialDayReviewSessionUseCase` (L377–395)

- **Decoradores:** `@Injectable()`
- **Propósito:** One session with its stored before/after photographs.
- **Dependencias inyectadas (constructor):** `@Inject(FINANCIAL_DAY_REVIEW_REPOSITORY) repository: FinancialDayReviewRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 384–394 | `input: { sessionId: string; role: string; }` | `Promise<ReviewSessionRow>` |

##### `GetFinancialDayReviewSessionUseCase.execute`

- **Firma:** `execute(input: { sessionId: string; role: string; }): Promise<ReviewSessionRow>` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L384) (L384–394)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `assertPermission`, `this.repository.findSessionById`, `financialDayReviewError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `financialDayReviewError('FINANCIAL_REVIEW_SESSION_NOT_FOUND')`
- **Consumidores:** [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)

#### Función `assertPermission` (L29–36)

- **Tipo:** función local del archivo
- **Firma:** `assertPermission(role: string \| undefined, permission: FinancialDayPermission): void` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L29)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `hasFinancialDayPermission`, `financialDayReviewError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `financialDayReviewError('FINANCIAL_REVIEW_FORBIDDEN')`
- **Consumidores:** uso interno del archivo

#### Función `assertDate` (L38–42)

- **Tipo:** función local del archivo
- **Firma:** `assertDate(value: string): void` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L38)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `ISO_DATE.test`, `Number.isNaN`, `Date.parse`, `financialDayReviewError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `financialDayReviewError('FINANCIAL_REVIEW_INVALID_DATE')`
- **Consumidores:** uso interno del archivo

#### Función `findCorrection` (L250–261)

- **Tipo:** función local del archivo, async
- **Firma:** `findCorrection(repository: FinancialDayReviewRepository, sessionId: string, id: string): Promise<CorrectionRow>` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L250)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `repository.listCorrections`, `corrections.find`, `financialDayReviewError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `financialDayReviewError('FINANCIAL_REVIEW_TARGET_NOT_FOUND')`
- **Consumidores:** uso interno del archivo

#### Función `buildCloseSummary` (L264–292)

- **Tipo:** función local del archivo
- **Firma:** `buildCloseSummary(session: ReviewSessionRow, corrections: CorrectionRow[], diagnosis: FinancialDayDiagnosis): CloseSummaryOutput` — [financial-day-review.use-cases.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts#L264)
- **Propósito / descripción:** Builds the close summary from the session's audit trail and the day's current diagnosis.
- **Dependencias:** `corrections.filter`, `modules.includes`, `new Set`, `corrections.filter((c) => c.module === 'BANCOS' \|\| c.module === 'TRANSACCIONES').map`, `count`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-financial-day-review-domain-errors-financial-day-review-errors-ts"></a>

### financial-day-review.errors.ts

- **Ruta:** [financial-day-review.errors.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/errors/financial-day-review.errors.ts) (`comercial-jhoel-api/src/modules/financial-day-review/domain/errors/financial-day-review.errors.ts`, 144 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `financial-day-review`
- **Responsabilidad:** Business-rule violation of "Revisión de días operativos".
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [financial-day-review.use-cases.spec.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-spec-ts), [financial-day-review.use-cases.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts), [typeorm-financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-infrastructure-persistence-typeorm-financial-day-review-repository-ts), [global-exception.filter.ts](shared.md#f-comercial-jhoel-api-src-shared-filters-global-exception-filter-ts)

#### Clase `FinancialDayReviewError` (L8–16)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Business-rule violation of "Revisión de días operativos". The rules live in PostgreSQL (`RAISE EXCEPTION '&lt;CODE&gt;:&lt;detail&gt;'`); this carries the stable code, its user-facing message and HTTP status.
- **Dependencias inyectadas (constructor):** `code: string`, `message: string`, `status: number`
#### Función `financialDayReviewError` (L120–133)

- **Tipo:** función exportada
- **Firma:** `financialDayReviewError(code: string, detail?: string): FinancialDayReviewError` — [financial-day-review.errors.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/errors/financial-day-review.errors.ts#L120)
- **Propósito / descripción:** Builds the domain error for a known code (with an optional extra detail).
- **Dependencias:** `detail.split`, `new FinancialDayReviewError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [financial-day-review.use-cases.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts), [typeorm-financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-infrastructure-persistence-typeorm-financial-day-review-repository-ts)

#### Función `financialDayReviewErrorFromMessage` (L136–143)

- **Tipo:** función exportada
- **Firma:** `financialDayReviewErrorFromMessage(message: string): FinancialDayReviewError \| null` — [financial-day-review.errors.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/errors/financial-day-review.errors.ts#L136)
- **Propósito / descripción:** `RAISE EXCEPTION '&lt;CODE&gt;:&lt;detail&gt;'` → domain error; `null` if it is not one of ours.
- **Dependencias:** `message.indexOf`, `message.slice`, `financialDayReviewError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-infrastructure-persistence-typeorm-financial-day-review-repository-ts), [global-exception.filter.ts](shared.md#f-comercial-jhoel-api-src-shared-filters-global-exception-filter-ts)

<a id="f-comercial-jhoel-api-src-modules-financial-day-review-domain-financial-day-permissions-ts"></a>

### financial-day-permissions.ts

- **Ruta:** [financial-day-permissions.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/financial-day-permissions.ts) (`comercial-jhoel-api/src/modules/financial-day-review/domain/financial-day-permissions.ts`, 34 líneas)
- **Tipo:** Código TypeScript · **Capa:** Dominio · **Módulo:** Módulo backend `financial-day-review`
- **Responsabilidad:** Permissions of "Revisión de días operativos".
- **Descripción del autor (comentario del archivo):** Permissions of "Revisión de días operativos". The app's RBAC is role-based (no per-user permission table), so each permission maps to the roles that hold it. The SQL write functions enforce the very same map (`financial_review_assert_role`), so the API check is defence in depth, never the only barrier. - `financial_days.review` — browse days, diagnostics, audit (read only). - `financial_days.correct` — open/close a review session and correct data.
- **Consumidores:** [financial-day-review.use-cases.spec.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-spec-ts), [financial-day-review.use-cases.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts)

**Interfaces, tipos y enums:**

- `type FinancialDayPermission` (L16) = `(typeof FINANCIAL_DAY_PERMISSIONS)[keyof typeof FINANCIAL_DAY_PERMISSIONS]`

**Constantes exportadas:**

- `FINANCIAL_DAY_PERMISSIONS` (L11): Permissions of "Revisión de días operativos". = `{ review: 'financial_days.review', correct: 'financial_days.correct', } as const`
- `FINANCIAL_DAY_PERMISSION_ROLES` (L19) = `{ 'financial_days.review': ['SUPER_ADMIN', 'ADMIN'], 'financial_days.correct': ['SUPER_ADMIN'], }`
#### Función `hasFinancialDayPermission` (L28–33)

- **Tipo:** función exportada
- **Firma:** `hasFinancialDayPermission(role: string \| undefined \| null, permission: FinancialDayPermission): boolean` — [financial-day-permissions.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/financial-day-permissions.ts#L28)
- **Propósito / descripción:** True when `role` holds `permission`.
- **Dependencias:** `FINANCIAL_DAY_PERMISSION_ROLES[permission].includes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [financial-day-review.use-cases.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts)

<a id="f-comercial-jhoel-api-src-modules-financial-day-review-domain-repositories-financial-day-review-repository-ts"></a>

### financial-day-review.repository.ts

- **Ruta:** [financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/repositories/financial-day-review.repository.ts) (`comercial-jhoel-api/src/modules/financial-day-review/domain/repositories/financial-day-review.repository.ts`, 437 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `financial-day-review`
- **Responsabilidad:** Port of "Revisión de días operativos".
- **Descripción del autor (comentario del archivo):** Port of "Revisión de días operativos". Reads return the raw rows of ONE operational day exactly as stored (plus the review adjustments in force); every calculation over them lives in the pure domain service `financial-day-diagnostics.ts`. Writes delegate to the PostgreSQL functions of migration 1760007100000, which enforce isolation, RBAC and audit.
- **Consumidores:** [financial-day-review.use-cases.spec.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-spec-ts), [financial-day-review.use-cases.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts), [financial-day-diagnostics.spec.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-services-financial-day-diagnostics-spec-ts), [financial-day-diagnostics.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-services-financial-day-diagnostics-ts), [financial-day-review.module.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-financial-day-review-module-ts), [typeorm-financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-infrastructure-persistence-typeorm-financial-day-review-repository-ts), [financial-day-review.request.dto.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-dtos-financial-day-review-request-dto-ts)

**Interfaces, tipos y enums:**

- `interface ReviewSessionRow` (L55): sin documentación — miembros: `id`, `reviewDate`, `status`, `reason`, `openedById`, `openedByUsername`, `openedAt`, `closeRequestedAt`, `closedByUsername`, `closedAt`, `closeObservations`, `correctionsCount`, `hasPendingDifferences`, `differenceBefore`, `differenceAfter`, `snapshotBefore`, `snapshotAfter`
- `interface CorrectionRow` (L75): sin documentación — miembros: `id`, `sessionId`, `reviewDate`, `module`, `correctionType`, `targetTable`, `targetId`, `field`, `originalValue`, `newValue`, `difference`, `reason`, `observations`, `originalReference`, `createdByUsername`, `createdAt`
- `interface FinancialDayListRow` (L95): One calendar row (cheap aggregates, no full diagnosis). — miembros: `date`, `agentDayStatus`, `cashDayStatus`, `cashOpening`, `cashClosing`, `totalBanks`, `totalAccountsReceivable`, `totalAssets`, `reconciliationResult`, `movementCount`, `cutCount`, `hasDifferences`, `activeSessionId`, `activeSessionUsername`, `reviewCount`
- `interface AgentDayRaw` (L113): sin documentación — miembros: `status`, `openedAt`, `openedByUsername`, `closedAt`, `closedByUsername`, `reopenedAt`, `reopenReason`
- `interface DayBankRaw` (L123): sin documentación — miembros: `bankId`, `name`, `accountNumber`, `specialAccount`, `accountTypeName`, `isActive`, `balanceRowId`, `previousBalance`, `finalBalance`, `previousDayDate`, `previousDayFinal`, `nextDayDate`, `nextDayPrevious`, `ledgerOpening`, `firstLedgerDate`
- `interface DayBankMovementRaw` (L141): sin documentación — miembros: `id`, `sequence`, `bankId`, `bankName`, `movementType`, `origin`, `amount`, `balanceBefore`, `balanceAfter`, `status`, `referenceType`, `referenceId`, `referenceText`, `concept`, `createdAt`, `username`
- `interface DayTransactionRaw` (L160): sin documentación — miembros: `id`, `typeName`, `balanceEffect`, `cashEffect`, `totalAmount`, `transactionCount`, `agentBankName`, `bankAccountId`, `bankAccountName`, `clientName`, `description`, `isVoided`, `createdAt`, `username`
- `interface DayCashMovementRaw` (L178): sin documentación — miembros: `id`, `sequence`, `movementType`, `direction`, `amount`, `previousBalance`, `newBalance`, `status`, `referenceType`, `referenceId`, `description`, `bankName`, `cutPeriodId`, `createdAt`, `username`
- `interface CashDayRaw` (L196): sin documentación — miembros: `id`, `status`, `openingPolicy`, `openingSystemCash`, `openingPhysicalCash`, `previousClosingPhysicalCash`, `previousClosingSystemCash`, `inheritedDifference`, `openingSequence`, `closingSequence`, `closingSystemCash`, `closingPhysicalCash`, `closingDifference`, `totalIn`, `totalOut`, `movementCount`, `openedAt`, `closedAt`, `previousDayDate`, `previousDayClosingPhysical`, `nextDayDate`, `nextDayOpeningPhysical`
- `interface CutCountRaw` (L221): sin documentación — miembros: `id`, `totalCounted`, `systemCash`, `difference`, `isCurrent`, `createdAt`, `username`
- `interface CutBankReconciliationRaw` (L231): sin documentación — miembros: `id`, `bankId`, `bankName`, `systemBalance`, `verifiedBalance`, `difference`, `countId`
- `interface CashCutRaw` (L241): sin documentación — miembros: `id`, `periodNumber`, `status`, `scheduledStartAt`, `scheduledEndAt`, `actualStartedAt`, `actualFinishedAt`, `startSequence`, `closingSequence`, `openingSystemCash`, `openingPhysicalCash`, `closingSystemCash`, `closingPhysicalCash`, `cashDifference`, `totalIn`, `totalOut`, `movementCount`, `reopenedCount`, `rangeIn`, `rangeOut`, `rangeCount`, `counts`, `bankReconciliations`
- `interface PortfolioRowRaw` (L268): sin documentación — miembros: `id`, `sequence`, `clientId`, `clientName`, `date`, `amount`, `movementType`, `description`, `referenceType`, `isActive`, `createdAt`, `updatedAt`, `username`
- `interface PortfolioClientRaw` (L284): sin documentación — miembros: `clientId`, `clientName`, `opening`, `charges`, `payments`, `settlements`
- `interface PortfolioLateRowRaw` (L296) extends PortfolioRowRaw: A row that can explain why a stored total differs from today's recalculation. — miembros: `kind`
- `interface PortfolioRaw` (L303): sin documentación — miembros: `clients`, `rows`, `lateRows`
- `interface ReconciliationRaw` (L309): sin documentación — miembros: `id`, `totalCash`, `totalWarehouseCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `result`, `createdAt`, `username`, `rowsForDate`
- `interface AdjustmentEffectRaw` (L323): sin documentación — miembros: `scope`, `bankId`, `clientId`, `amount`
- `interface AdjustmentRaw` (L330): sin documentación — miembros: `id`, `correctionId`, `module`, `sourceTable`, `sourceId`, `originalAmount`, `correctedAmount`, `delta`, `effects`
- `interface AdjacentMovementRaw` (L342): sin documentación — miembros: `source`, `id`, `date`, `label`, `amount`, `bankId`
- `interface FinancialDayRawData` (L352): Everything stored for ONE operational day. — miembros: `date`, `agentDay`, `banks`, `bankMovements`, `transactions`, `cashDay`, `cuts`, `cashMovements`, `receivables`, `assets`, `reconciliation`, `adjustments`, `adjacentMovements`
- `interface PhotographSummary` (L369): sin documentación — miembros: `snapshot`, `totalDifference`, `hasPendingDifferences`
- `interface CorrectSnapshotData` (L375): sin documentación — miembros: `sessionId`, `target`, `targetId`, `field`, `newValue`, `reason`, `observations`, `userId`, `requestId`
- `interface AdjustMovementData` (L387): sin documentación — miembros: `sessionId`, `source`, `sourceId`, `correctedAmount`, `reason`, `observations`, `userId`, `requestId`
- `interface CloseSessionData` (L398): sin documentación — miembros: `sessionId`, `userId`, `observations`, `acceptPendingDifferences`
- `interface FinancialDayReviewRepository` (L405): sin documentación — miembros: `listDays`, `getDayData`, `openSession`, `correctSnapshot`, `adjustMovement`, `requestClose`, `closeSession`, `findSessionById`, `findActiveSession`, `listSessions`, `listCorrections`
- `type ReviewSessionStatus` (L18) = `(typeof REVIEW_SESSION_STATUSES)[number]`
- `type SnapshotTarget` (L34) = `keyof typeof SNAPSHOT_TARGETS`
- `type MovementSource` (L44) = `(typeof MOVEMENT_SOURCES)[number]`
- `type ReviewModule` (L46) = `\| 'BANCOS' \| 'EFECTIVO' \| 'CORTES' \| 'CUENTAS_POR_COBRAR' \| 'ACTIVOS' \| 'TRANSACCIONES' \| 'CUADRE'`

**Constantes exportadas:**

- `FINANCIAL_DAY_REVIEW_REPOSITORY` (L8): Port of "Revisión de días operativos". = `Symbol( 'FINANCIAL_DAY_REVIEW_REPOSITORY', )`
- `REVIEW_SESSION_STATUSES` (L12) = `[ 'OPEN', 'IN_REVIEW', 'PENDING_CONFIRMATION', 'CLOSED', ] as const`
- `SNAPSHOT_TARGETS` (L21): Day-owned snapshot rows that are corrected in place (with a version). = `{ BANK_BALANCE: ['previous_balance', 'final_balance'], AGENT_RECONCILIATION: [ 'total_cash', 'total_banks', 't`
- `MOVEMENT_SOURCES` (L37): Ledger records corrected through a linked adjustment (never edited). = `[ 'CASH_MOVEMENT', 'BANK_MOVEMENT', 'TRANSACTION', 'ACCOUNT_RECEIVABLE', 'ASSET', ] as const`
<a id="f-comercial-jhoel-api-src-modules-financial-day-review-domain-services-financial-day-diagnostics-spec-ts"></a>

### financial-day-diagnostics.spec.ts

- **Ruta:** [financial-day-diagnostics.spec.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.spec.ts) (`comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.spec.ts`, 439 líneas)
- **Tipo:** Prueba unitaria · **Capa:** Dominio · **Módulo:** Módulo backend `financial-day-review`
- **Responsabilidad:** Prueba unitaria: declara `emptyPortfolio`, `baseDay`, `DAY`, `BANK`, `CLIENT` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-repositories-financial-day-review-repository-ts), [financial-day-diagnostics.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-services-financial-day-diagnostics-ts)
- **Consumidores:** —
#### Función `emptyPortfolio` (L15–17)

- **Tipo:** función local del archivo
- **Firma:** `emptyPortfolio()` — [financial-day-diagnostics.spec.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.spec.ts#L15)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `baseDay` (L19–93)

- **Tipo:** función local del archivo
- **Firma:** `baseDay(overrides?: Partial<FinancialDayRawData>): FinancialDayRawData` — [financial-day-diagnostics.spec.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.spec.ts#L19)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `emptyPortfolio`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-financial-day-review-domain-services-financial-day-diagnostics-ts"></a>

### financial-day-diagnostics.ts

- **Ruta:** [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts) (`comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts`, 1459 líneas)
- **Tipo:** Código TypeScript · **Capa:** Dominio · **Módulo:** Módulo backend `financial-day-review`
- **Responsabilidad:** Rounds to cents (avoids binary float noise in every sum).
- **Depende de (archivos del proyecto):** [financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-repositories-financial-day-review-repository-ts)
- **Consumidores:** [financial-day-review.use-cases.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts), [financial-day-diagnostics.spec.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-services-financial-day-diagnostics-spec-ts)

**Interfaces, tipos y enums:**

- `interface RelatedMovement` (L94): sin documentación — miembros: `source`, `id`, `label`, `amount`, `date`, `match`, `pairWithId`
- `interface CandidateMovement` (L104): sin documentación — miembros: `source`, `id`, `label`, `amount`, `date`
- `interface DifferenceItem` (L185): sin documentación — miembros: `key`, `module`, `account`, `type`, `label`, `expected`, `registered`, `difference`, `related`, `reference`, `target`
- `interface BankDiagnosis` (L205): sin documentación — miembros: `bankId`, `name`, `maskedAccount`, `specialAccount`, `accountTypeName`, `creditLine`, `outsideReconciliation`, `balanceRowId`, `openingRegistered`, `previousDayDate`, `previousDayFinal`, `openingMismatch`, `ledgerAvailable`, `ledgerOpening`, `totals`, `reviewAdjustments`, `movementsTotal`, `theoreticalClosing`, `registeredClosing`, `difference`, `nextDayDate`, `nextDayOpening`, `nextDayMismatch`, `movementCount`
- `interface CashDiagnosis` (L232): sin documentación — miembros: `available`, `dayId`, `status`, `openingPolicy`, `openingSystem`, `openingPhysical`, `previousDayDate`, `previousDayClosingPhysical`, `openingMismatch`, `totalIn`, `totalOut`, `reviewAdjustments`, `theoretical`, `registeredSystemClosing`, `kardexDifference`, `counted`, `physicalDifference`, `registeredClosingDifference`, `nextDayDate`, `nextDayOpeningPhysical`, `nextDayMismatch`, `movementCount`
- `interface CutDiagnosis` (L257): sin documentación — miembros: `id`, `periodNumber`, `status`, `scheduledStartAt`, `scheduledEndAt`, `actualStartedAt`, `actualFinishedAt`, `openingSystem`, `openingPhysical`, `closingSystem`, `closingPhysical`, `cashDifference`, `registeredIn`, `registeredOut`, `recomputedIn`, `recomputedOut`, `movementCount`, `reopenedCount`, `currentCount`, `previousCounts`, `bankReconciliations`
- `interface PortfolioClientDiagnosis` (L294): sin documentación — miembros: `clientId`, `clientName`, `opening`, `charges`, `payments`, `settlements`, `reviewAdjustments`, `closing`
- `interface PortfolioDiagnosis` (L305): sin documentación — miembros: `clients`, `totals`, `rows`, `registeredTotal`, `difference`, `lateRows`
- `interface ReconciliationDiagnosis` (L318): sin documentación — miembros: `available`, `id`, `totalCash`, `totalWarehouseCash`, `totalBanks`, `totalAssets`, `totalAccountsReceivable`, `result`, `recomputedResult`, `createdAt`, `username`, `rowsForDate`, `expectedBanks`, `expectedBanksPreviousRule`, `missingBankSnapshots`, `expectedAccountsReceivable`, `expectedAssets`, `expectedCash`
- `interface DayMovementView` (L344): sin documentación — miembros: `source`, `id`, `at`, `type`, `label`, `amount`, `account`, `cashEffect`, `bankEffect`, `balanceBefore`, `balanceAfter`, `reference`, `username`, `status`, `adjustable`, `adjustment`
- `interface FinancialDayDiagnosis` (L363): sin documentación — miembros: `date`, `agentDay`, `banks`, `bankTotals`, `cash`, `cuts`, `receivables`, `assets`, `reconciliation`, `movements`, `differences`, `totalAbsoluteDifference`, `hasPendingDifferences`
- `type BankMovementCategory` (L61) = `\| 'deposits' \| 'withdrawals' \| 'transfersIn' \| 'transfersOut' \| 'disbursements' \| 'payments' \| 'reimbursements' \| 'adjustments'`
- `type MatchKind` (L91) = `'EXACT' \| 'SIGN_INVERTED' \| 'PAIR' \| 'ADJACENT_DAY' \| 'LATE_ROW'`
#### Función `cents` (L26–28)

- **Tipo:** función exportada
- **Firma:** `cents(value: number): number` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L26)
- **Propósito / descripción:** Rounds to cents (avoids binary float noise in every sum).
- **Dependencias:** `Math.round`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `isZero` (L30–32)

- **Tipo:** función local del archivo
- **Firma:** `isZero(value: number \| null \| undefined): boolean` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L30)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Math.abs`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `maskAccountNumber` (L35–44)

- **Tipo:** función exportada
- **Firma:** `maskAccountNumber(accountNumber: string \| null): string \| null` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L35)
- **Propósito / descripción:** Shows only the last 4 digits of an account number.
- **Dependencias:** `accountNumber.trim`, `'•'.repeat`, `Math.min`, `clean.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `isCreditLineType` (L47–59)

- **Tipo:** función exportada
- **Firma:** `isCreditLineType(accountTypeName: string, specialAccount: string \| null): boolean` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L47)
- **Propósito / descripción:** Same rule as `GetCuadreAgentesSummaryUseCase`: a "crédito" account type subtracts (except BI Club).
- **Dependencias:** `accountTypeName.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes`, `accountTypeName.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase`, `accountTypeName.normalize('NFD').replace`, `accountTypeName.normalize`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `bankMovementCategory` (L85–89)

- **Tipo:** función exportada
- **Firma:** `bankMovementCategory(movementType: string): BankMovementCategory` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L85)
- **Propósito / descripción:** Ledger movement type → column of the "Agentes Bancarios" panel.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `explainDifference` (L119–160)

- **Tipo:** función exportada
- **Firma:** `explainDifference(difference: number, candidates: CandidateMovement[], limit?): RelatedMovement[]` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L119)
- **Propósito / descripción:** Movements whose amounts verifiably account for `difference`: one movement of the same size (EXACT), of half the size (SIGN_INVERTED: registered with the wrong sign), or two movements that add up to it (PAIR). Bounded so a busy day never explodes the response.
- **Dependencias:** `Math.abs`, `cents`, `new Set`, `seen.has`, `seen.add`, `found.push`, `push`, `candidates.filter((c) => !isZero(c.amount)).slice`, `candidates.filter`, `isZero`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `adjacentMatches` (L163–181)

- **Tipo:** función local del archivo
- **Firma:** `adjacentMatches(difference: number, data: FinancialDayRawData, filter: (source: string, bankId: string \| null) => boolean): RelatedMovement[]` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L163)
- **Propósito / descripción:** Same-size movements dated the previous/next day: possibly registered on the wrong date.
- **Dependencias:** `Math.abs`, `cents`, `data.adjacentMovements.filter((m) => filter(m.source, m.bankId)).filter`, `data.adjacentMovements.filter`, `filter`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `adjustmentEffects` (L387–416)

- **Tipo:** función local del archivo
- **Firma:** `adjustmentEffects(adjustments: AdjustmentRaw[])` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L387)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `cents`, `adjustments.flatMap((a) => a.effects).filter((e) => e.scope === 'CASH').reduce`, `adjustments.flatMap((a) => a.effects).filter`, `adjustments.flatMap`, `new Map`, `bank.set`, `bank.get`, `ar.set`, `ar.get`, `asset.set`, `asset.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildBanks` (L418–487)

- **Tipo:** función local del archivo
- **Firma:** `buildBanks(data: FinancialDayRawData, bankAdjustments: Map<string, number>): BankDiagnosis[]` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L418)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `data.banks.map`, `data.bankMovements.filter`, `bankMovementCategory`, `cents`, `movements.reduce`, `bankAdjustments.get`, `maskAccountNumber`, `isCreditLineType`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `signedCash` (L489–491)

- **Tipo:** función local del archivo
- **Firma:** `signedCash(direction: string, amount: number): number` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L489)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildCash` (L493–573)

- **Tipo:** función local del archivo
- **Firma:** `buildCash(data: FinancialDayRawData, cashAdjustment: number): CashDiagnosis` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L493)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `cents`, `data.cashMovements.filter((m) => m.direction === 'IN').reduce`, `data.cashMovements.filter`, `data.cashMovements.filter((m) => m.direction === 'OUT').reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildCuts` (L575–619)

- **Tipo:** función local del archivo
- **Firma:** `buildCuts(data: FinancialDayRawData): CutDiagnosis[]` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L575)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `data.cuts.map`, `cut.counts.find`, `cut.counts.filter`, `cut.bankReconciliations.filter((r) => !current \|\| r.countId === current.id).map`, `cut.bankReconciliations.filter`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildPortfolio` (L621–677)

- **Tipo:** función local del archivo
- **Firma:** `buildPortfolio(raw: PortfolioRaw, table: 'accounts_receivable' \| 'assets', effects: Map<string, number>, adjustments: AdjustmentRaw[], registeredTotal: number \| null): PortfolioDiagnosis` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L621)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `raw.clients.map`, `effects.get`, `cents`, `clients.reduce`, `pick`, `sum`, `new Map`, `adjustments.filter((a) => a.sourceTable === table).map`, `adjustments.filter`, `raw.rows.map`, `bySource.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildMovements` (L679–818)

- **Tipo:** función local del archivo
- **Firma:** `buildMovements(data: FinancialDayRawData): DayMovementView[]` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L679)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `data.adjustments.find`, `cents`, `data.cashMovements.filter`, `signedCash`, `data.bankMovements.filter`, `views.push`, `[tx.typeName, tx.description, tx.agentBankName, tx.clientName].filter(Boolean).join`, `[tx.typeName, tx.description, tx.agentBankName, tx.clientName].filter`, `cashFor`, `bankRows.reduce`, `adjustmentFor`, `Math.abs`, `[row.clientName, row.description].filter(Boolean).join`, `[row.clientName, row.description].filter`, `portfolio`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildReconciliation` (L820–883)

- **Tipo:** función local del archivo
- **Firma:** `buildReconciliation(data: FinancialDayRawData, banks: BankDiagnosis[], receivables: PortfolioDiagnosis, assets: PortfolioDiagnosis, cash: CashDiagnosis): ReconciliationDiagnosis` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L820)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `banks.filter`, `banks.filter((b) => !b.outsideReconciliation && !b.balanceRowId).map`, `cents`, `included.reduce`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `lateRelated` (L885–897)

- **Tipo:** función local del archivo
- **Firma:** `lateRelated(rows: PortfolioLateRowRaw[], source: 'ACCOUNT_RECEIVABLE' \| 'ASSET'): RelatedMovement[]` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L885)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `rows.slice(0, 15).map`, `rows.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `buildDifferences` (L899–1320)

- **Tipo:** función local del archivo
- **Firma:** `buildDifferences(data: FinancialDayRawData, banks: BankDiagnosis[], cash: CashDiagnosis, cuts: CutDiagnosis[], receivables: PortfolioDiagnosis, assets: PortfolioDiagnosis, reconciliation: ReconciliationDiagnosis): DifferenceItem[]` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L899)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `isZero`, `list.push`, `cents`, `data.bankMovements.filter((m) => m.bankId === bank.bankId).map`, `data.bankMovements.filter`, `data.transactions.some`, `add`, `explainDifference`, `adjacentMatches`, `data.cashMovements.map`, `signedCash`, `[...cuts].sort`, `receivables.rows.map`, `lateRelated`, `assets.rows.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `diagnoseFinancialDay` (L1323–1398)

- **Tipo:** función exportada
- **Firma:** `diagnoseFinancialDay(data: FinancialDayRawData): FinancialDayDiagnosis` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L1323)
- **Propósito / descripción:** Full diagnosis of one day (recomputed figures, differences and movements).
- **Dependencias:** `adjustmentEffects`, `buildBanks`, `banks.filter`, `cents`, `included.reduce`, `buildCash`, `buildCuts`, `buildPortfolio`, `buildReconciliation`, `buildDifferences`, `differences.filter`, `actionable.reduce`, `Math.abs`, `buildMovements`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [financial-day-review.use-cases.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts)

#### Función `photographOf` (L1401–1458)

- **Tipo:** función exportada
- **Firma:** `photographOf(data: FinancialDayRawData): PhotographSummary` — [financial-day-diagnostics.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/services/financial-day-diagnostics.ts#L1401)
- **Propósito / descripción:** The photograph stored in the session at open (before) and close (after).
- **Dependencias:** `diagnoseFinancialDay`, `new Date().toISOString`, `new Date`, `diagnosis.banks.map`, `diagnosis.cuts.map`, `diagnosis.differences.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

<a id="f-comercial-jhoel-api-src-modules-financial-day-review-financial-day-review-module-ts"></a>

### financial-day-review.module.ts

- **Ruta:** [financial-day-review.module.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/financial-day-review.module.ts) (`comercial-jhoel-api/src/modules/financial-day-review/financial-day-review.module.ts`, 42 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `financial-day-review`
- **Responsabilidad:** "Revisión de días operativos" — audited review mode for one past operational day (diagnosis, isolated corrections, close).
- **Depende de (archivos del proyecto):** [financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-repositories-financial-day-review-repository-ts), [typeorm-financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-infrastructure-persistence-typeorm-financial-day-review-repository-ts), [financial-day-review.use-cases.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts), [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `FinancialDayReviewModule` (L23–41)

- **Decoradores:** `@Module({ controllers: [FinancialDayReviewController], providers: [ { provide: FINANCIAL_DAY_REVIEW_REPOSITORY, useClass: TypeOrmFinancialDayReviewRepository, },`
- **Propósito:** "Revisión de días operativos" — audited review mode for one past operational day (diagnosis, isolated corrections, close). Raw SQL over the existing financial tables; all writes go through the PostgreSQL functions of migration 1760007100000.
<a id="f-comercial-jhoel-api-src-modules-financial-day-review-infrastructure-persistence-typeorm-financial-day-review-repository-ts"></a>

### typeorm-financial-day-review.repository.ts

- **Ruta:** [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts) (`comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts`, 930 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `financial-day-review`
- **Responsabilidad:** Raw-SQL adapter of "Revisión de días operativos".
- **Depende de (archivos del proyecto):** [financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-repositories-financial-day-review-repository-ts), [financial-day-review.errors.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-errors-financial-day-review-errors-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [financial-day-review.module.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-financial-day-review-module-ts)

**Interfaces, tipos y enums:**

- `type SqlRow` (L36) = `Record<string, unknown>`
- `type PortfolioTable` (L75) = `'accounts_receivable' \| 'assets'` — Portfolio tables share one shape; the name is whitelisted, never user input.

#### Clase `TypeOrmFinancialDayReviewRepository` (L97–929)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements FinancialDayReviewRepository
- **Propósito:** Raw-SQL adapter of "Revisión de días operativos". Reads are plain SELECTs scoped to one date; every write is one call to the migration's PostgreSQL functions (which lock, validate the day, audit and version), so nothing in this class can modify a row of another day.
- **Dependencias inyectadas (constructor):** `@InjectDataSource() dataSource: DataSource`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `listDays` | método public async | 101–169 | `from: string`, `to: string` | `Promise<FinancialDayListRow[]>` |
| `getDayData` | método public | 171–173 | `day: string` | `Promise<FinancialDayRawData>` |
| `openSession` | método public async | 175–197 | `day: string`, `userId: string`, `reason: string`, `photograph: (data: FinancialDayRawData) => PhotographSummary` | `Promise<string>` |
| `correctSnapshot` | método public async | 199–217 | `data: CorrectSnapshotData` | `Promise<string>` |
| `adjustMovement` | método public async | 219–236 | `data: AdjustMovementData` | `Promise<string>` |
| `requestClose` | método public async | 238–245 | `sessionId: string`, `userId: string` | `Promise<void>` |
| `closeSession` | método public async | 247–278 | `data: CloseSessionData`, `photograph: (data: FinancialDayRawData) => PhotographSummary` | `Promise<void>` |
| `findSessionById` | método public async | 280–286 | `id: string` | `Promise<ReviewSessionRow \| null>` |
| `findActiveSession` | método public async | 288–294 | `day: string` | `Promise<ReviewSessionRow \| null>` |
| `listSessions` | método public async | 296–302 | `day: string` | `Promise<ReviewSessionRow[]>` |
| `listCorrections` | método public async | 304–339 | `filter: { date?: string; sessionId?: string; }` | `Promise<CorrectionRow[]>` |
| `loadDay` | método private async | 343–385 | `day: string`, `manager: EntityManager` | `Promise<FinancialDayRawData>` |
| `loadAgentDay` | método private async | 387–415 | `day: string`, `manager: EntityManager` | `Promise<AgentDayRaw \| null>` |
| `loadBanks` | método private async | 417–465 | `day: string`, `manager: EntityManager` | `Promise<DayBankRaw[]>` |
| `loadBankMovements` | método private async | 467–498 | `day: string`, `manager: EntityManager` | `Promise<DayBankMovementRaw[]>` |
| `loadTransactions` | método private async | 500–533 | `day: string`, `manager: EntityManager` | `Promise<DayTransactionRaw[]>` |
| `loadCashDay` | método private async | 535–585 | `day: string`, `manager: EntityManager` | `Promise<CashDayRaw \| null>` |
| `loadCuts` | método private async | 587–668 | `dayId: string`, `manager: EntityManager` | `Promise<CashCutRaw[]>` |
| `loadCashMovements` | método private async | 670–696 | `day: string`, `manager: EntityManager` | `Promise<DayCashMovementRaw[]>` |
| `toPortfolioRow` | método private | 698–714 | `row: SqlRow` | `PortfolioRowRaw` |
| `loadPortfolio` | método private async | 716–782 | `table: PortfolioTable`, `day: string`, `reconciliation: ReconciliationRaw \| null`, `manager: EntityManager` | `Promise<PortfolioRaw>` |
| `loadReconciliation` | método private async | 784–810 | `day: string`, `manager: EntityManager` | `Promise<ReconciliationRaw \| null>` |
| `loadAdjustments` | método private async | 812–843 | `day: string`, `manager: EntityManager` | `Promise<AdjustmentRaw[]>` |
| `loadAdjacent` | método private async | 845–886 | `day: string`, `manager: EntityManager` | `Promise<AdjacentMovementRaw[]>` |
| `toSession` | método private | 888–912 | `row: SqlRow` | `ReviewSessionRow` |
| `run` | método private async | 915–928 | `work: () => Promise<T>` | `Promise<T>` |

##### `TypeOrmFinancialDayReviewRepository.listDays`

- **Firma:** `listDays(from: string, to: string): Promise<FinancialDayListRow[]>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L101) (L101–169)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `rows.map`, `str`, `strOrNull`, `numOrNull`, `num`
- **Efectos secundarios:** Tablas en su SQL: `day_openings`, `cash_operational_days`, `bank_balances`, `agent_reconciliations`, `bank_account_movements`, `bank_deposit_operations`, `cash_movements`, `accounts_receivable`, `assets`, `cash_cut_periods`, `financial_day_review_sessions`, `days`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmFinancialDayReviewRepository.getDayData`

- **Firma:** `getDayData(day: string): Promise<FinancialDayRawData>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L171) (L171–173)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadDay`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmFinancialDayReviewRepository.openSession`

- **Firma:** `openSession(day: string, userId: string, reason: string, photograph: (data: FinancialDayRawData) => PhotographSummary): Promise<string>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L175) (L175–197)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.run`, `this.dataSource.transaction`, `manager.query`, `photograph`, `this.loadDay`, `JSON.stringify`
- **Efectos secundarios:** Llama funciones SQL: `open_financial_day_review`; Tablas en su SQL: `financial_day_review_sessions`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmFinancialDayReviewRepository.correctSnapshot`

- **Firma:** `correctSnapshot(data: CorrectSnapshotData): Promise<string>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L199) (L199–217)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.run`, `this.dataSource.query`
- **Efectos secundarios:** Llama funciones SQL: `correct_financial_day_snapshot`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmFinancialDayReviewRepository.adjustMovement`

- **Firma:** `adjustMovement(data: AdjustMovementData): Promise<string>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L219) (L219–236)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.run`, `this.dataSource.query`
- **Efectos secundarios:** Llama funciones SQL: `adjust_financial_day_movement`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmFinancialDayReviewRepository.requestClose`

- **Firma:** `requestClose(sessionId: string, userId: string): Promise<void>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L238) (L238–245)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.run`, `this.dataSource.query`
- **Efectos secundarios:** Llama funciones SQL: `request_financial_day_review_close`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmFinancialDayReviewRepository.closeSession`

- **Firma:** `closeSession(data: CloseSessionData, photograph: (data: FinancialDayRawData) => PhotographSummary): Promise<void>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L247) (L247–278)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.run`, `this.dataSource.transaction`, `manager.query`, `financialDayReviewError`, `photograph`, `this.loadDay`, `str`, `JSON.stringify`
- **Efectos secundarios:** Llama funciones SQL: `close_financial_day_review`; Tablas en su SQL: `financial_day_review_sessions`; Ejecuta SQL crudo (`query`)
- **Errores que lanza:** `financialDayReviewError('FINANCIAL_REVIEW_SESSION_NOT_FOUND')`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmFinancialDayReviewRepository.findSessionById`

- **Firma:** `findSessionById(id: string): Promise<ReviewSessionRow \| null>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L280) (L280–286)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `this.toSession`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmFinancialDayReviewRepository.findActiveSession`

- **Firma:** `findActiveSession(day: string): Promise<ReviewSessionRow \| null>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L288) (L288–294)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `this.toSession`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmFinancialDayReviewRepository.listSessions`

- **Firma:** `listSessions(day: string): Promise<ReviewSessionRow[]>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L296) (L296–302)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `rows.map`, `this.toSession`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmFinancialDayReviewRepository.listCorrections`

- **Firma:** `listCorrections(filter: { date?: string; sessionId?: string; }): Promise<CorrectionRow[]>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L304) (L304–339)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.dataSource.query`, `rows.map`, `str`, `num`, `strOrNull`, `date`
- **Efectos secundarios:** Tablas en su SQL: `financial_day_corrections`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmFinancialDayReviewRepository.loadDay`

- **Firma:** `loadDay(day: string, manager: EntityManager): Promise<FinancialDayRawData>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L343) (L343–385)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.loadReconciliation`, `this.loadAgentDay`, `this.loadBanks`, `this.loadBankMovements`, `this.loadTransactions`, `this.loadCashDay`, `this.loadCashMovements`, `this.loadPortfolio`, `this.loadAdjustments`, `this.loadAdjacent`, `this.loadCuts`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.loadAgentDay`

- **Firma:** `loadAgentDay(day: string, manager: EntityManager): Promise<AgentDayRaw \| null>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L387) (L387–415)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `date`, `str`, `dateOrNull`, `strOrNull`
- **Efectos secundarios:** Tablas en su SQL: `day_openings`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.loadBanks`

- **Firma:** `loadBanks(day: string, manager: EntityManager): Promise<DayBankRaw[]>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L417) (L417–465)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `rows.map`, `str`, `strOrNull`, `numOrNull`
- **Efectos secundarios:** Tablas en su SQL: `bank_account_movements`, `banks`, `account_types`, `bank_balances`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.loadBankMovements`

- **Firma:** `loadBankMovements(day: string, manager: EntityManager): Promise<DayBankMovementRaw[]>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L467) (L467–498)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `rows.map`, `str`, `num`, `strOrNull`, `date`
- **Efectos secundarios:** Tablas en su SQL: `bank_account_movements`, `banks`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.loadTransactions`

- **Firma:** `loadTransactions(day: string, manager: EntityManager): Promise<DayTransactionRaw[]>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L500) (L500–533)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `rows.map`, `str`, `strOrNull`, `num`, `date`
- **Efectos secundarios:** Tablas en su SQL: `bank_deposit_operations`, `transaction_types`, `transaction_banks`, `banks`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.loadCashDay`

- **Firma:** `loadCashDay(day: string, manager: EntityManager): Promise<CashDayRaw \| null>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L535) (L535–585)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `str`, `num`, `numOrNull`, `date`, `dateOrNull`, `strOrNull`
- **Efectos secundarios:** Tablas en su SQL: `cash_operational_days`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.loadCuts`

- **Firma:** `loadCuts(dayId: string, manager: EntityManager): Promise<CashCutRaw[]>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L587) (L587–668)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `cuts.map`, `str`, `num`, `date`, `dateOrNull`, `numOrNull`, `counts.filter((count) => str(count.cut_period_id) === str(cut.id)).map`, `counts.filter`, `recs.filter((rec) => str(rec.cut_period_id) === str(cut.id)).map`, `recs.filter`
- **Efectos secundarios:** Tablas en su SQL: `cash_cut_periods`, `cash_movements`, `cash_cut_counts`, `users`, `cash_cut_bank_reconciliations`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.loadCashMovements`

- **Firma:** `loadCashMovements(day: string, manager: EntityManager): Promise<DayCashMovementRaw[]>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L670) (L670–696)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `rows.map`, `str`, `num`, `strOrNull`, `date`
- **Efectos secundarios:** Tablas en su SQL: `cash_movements`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.toPortfolioRow`

- **Firma:** `toPortfolioRow(row: SqlRow): PortfolioRowRaw` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L698) (L698–714)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `str`, `num`, `strOrNull`, `date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.loadPortfolio`

- **Firma:** `loadPortfolio(table: PortfolioTable, day: string, reconciliation: ReconciliationRaw \| null, manager: EntityManager): Promise<PortfolioRaw>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L716) (L716–782)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `late.map`, `this.toPortfolioRow`, `str`, `clientRows.map`, `num`, `rows.map`
- **Efectos secundarios:** Tablas en su SQL: `clients`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.loadReconciliation`

- **Firma:** `loadReconciliation(day: string, manager: EntityManager): Promise<ReconciliationRaw \| null>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L784) (L784–810)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `str`, `num`, `date`
- **Efectos secundarios:** Tablas en su SQL: `agent_reconciliations`, `users`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.loadAdjustments`

- **Firma:** `loadAdjustments(day: string, manager: EntityManager): Promise<AdjustmentRaw[]>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L812) (L812–843)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `rows.map`, `str`, `num`, `(row.effects as SqlRow[]).map`, `strOrNull`
- **Efectos secundarios:** Tablas en su SQL: `financial_day_adjustments`, `financial_day_adjustment_effects`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.loadAdjacent`

- **Firma:** `loadAdjacent(day: string, manager: EntityManager): Promise<AdjacentMovementRaw[]>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L845) (L845–886)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `manager.query`, `rows.map`, `str`, `num`, `strOrNull`
- **Efectos secundarios:** Tablas en su SQL: `bank_account_movements`, `banks`, `cash_movements`, `accounts_receivable`, `clients`, `assets`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.toSession`

- **Firma:** `toSession(row: SqlRow): ReviewSessionRow` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L888) (L888–912)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `str`, `date`, `dateOrNull`, `strOrNull`, `num`, `numOrNull`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmFinancialDayReviewRepository.run`

- **Firma:** `run(work: () => Promise<T>): Promise<T>` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L915) (L915–928)
- **Propósito / descripción:** Runs a write and maps `RAISE EXCEPTION '&lt;CODE&gt;'` to the domain error.
- **Dependencias (llamadas en su cuerpo):** `work`, `financialDayReviewErrorFromMessage`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `mapped`, `error`
- **Consumidores:** (mismo archivo)

#### Función `str` (L38–52)

- **Tipo:** función local del archivo
- **Firma:** `str(value: unknown): string` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L38)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `value.toString`, `value.toISOString`, `JSON.stringify`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `strOrNull` (L54–56)

- **Tipo:** función local del archivo
- **Firma:** `strOrNull(value: unknown): string \| null` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L54)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `str`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `num` (L58–60)

- **Tipo:** función local del archivo
- **Firma:** `num(value: unknown): number` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L58)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `numOrNull` (L62–64)

- **Tipo:** función local del archivo
- **Firma:** `numOrNull(value: unknown): number \| null` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L62)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `Number`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `date` (L66–68)

- **Tipo:** función local del archivo
- **Firma:** `date(value: unknown): Date` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L66)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `new Date`, `str`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

#### Función `dateOrNull` (L70–72)

- **Tipo:** función local del archivo
- **Firma:** `dateOrNull(value: unknown): Date \| null` — [typeorm-financial-day-review.repository.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts#L70)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `date`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** uso interno del archivo

<a id="f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts"></a>

### financial-day-review.controller.ts

- **Ruta:** [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts) (`comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts`, 179 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `financial-day-review`
- **Responsabilidad:** Sistema → Administración financiera → Revisión de días operativos.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [financial-day-review.use-cases.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-application-use-cases-financial-day-review-use-cases-ts), [financial-day-review.request.dto.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-dtos-financial-day-review-request-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [financial-day-review.module.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-financial-day-review-module-ts)

#### Clase `FinancialDayReviewController` (L45–178)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('SUPER_ADMIN', 'ADMIN')` `@Controller('financial-day-reviews')`
- **Propósito:** Sistema → Administración financiera → Revisión de días operativos. Class-level `@Roles`: only SUPER_ADMIN/ADMIN reach any route (`financial_days.review`); corrections, open and close additionally need `financial_days.correct` (SUPER_ADMIN), re-checked by each use case and again by the PostgreSQL functions.
- **Dependencias inyectadas (constructor):** `listDays: ListFinancialDaysUseCase`, `getDay: GetFinancialDayReviewUseCase`, `openReview: OpenFinancialDayReviewUseCase`, `correctSnapshot: CorrectFinancialDaySnapshotUseCase`, `adjustMovement: AdjustFinancialDayMovementUseCase`, `requestClose: RequestFinancialDayReviewCloseUseCase`, `closeReview: CloseFinancialDayReviewUseCase`, `listCorrections: ListFinancialDayCorrectionsUseCase`, `getSession: GetFinancialDayReviewSessionUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `days` | método public | 61–67 | `query: ListFinancialDaysQueryDto`, `user: RequestUser` | (inferido) |
| `day` | método public | 69–72 | `date: string`, `user: RequestUser` | (inferido) |
| `corrections` | método public | 74–80 | `query: ListCorrectionsQueryDto`, `user: RequestUser` | (inferido) |
| `open` | método public | 82–95 | `dto: OpenFinancialDayReviewRequestDto`, `user: RequestUser` | (inferido) |
| `session` | método public | 97–103 | `id: string`, `user: RequestUser` | (inferido) |
| `snapshot` | método public | 105–125 | `id: string`, `dto: CorrectSnapshotRequestDto`, `user: RequestUser` | (inferido) |
| `movement` | método public | 127–146 | `id: string`, `dto: AdjustMovementRequestDto`, `user: RequestUser` | (inferido) |
| `closeRequest` | método public | 148–160 | `id: string`, `user: RequestUser` | (inferido) |
| `close` | método public | 162–177 | `id: string`, `dto: CloseFinancialDayReviewRequestDto`, `user: RequestUser` | (inferido) |

##### `FinancialDayReviewController.days`

- **Firma:** `days(query: ListFinancialDaysQueryDto, user: RequestUser)` — [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L61) (L61–67)
- **Decoradores:** `@Get('days')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listDays.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialDayReviewController.day`

- **Firma:** `day(date: string, user: RequestUser)` — [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L69) (L69–72)
- **Decoradores:** `@Get('days/:date')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('date') date`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getDay.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialDayReviewController.corrections`

- **Firma:** `corrections(query: ListCorrectionsQueryDto, user: RequestUser)` — [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L74) (L74–80)
- **Decoradores:** `@Get('corrections')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.listCorrections.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialDayReviewController.open`

- **Firma:** `open(dto: OpenFinancialDayReviewRequestDto, user: RequestUser)` — [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L82) (L82–95)
- **Decoradores:** `@Post('sessions')` `@Roles('SUPER_ADMIN')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.openReview.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialDayReviewController.session`

- **Firma:** `session(id: string, user: RequestUser)` — [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L97) (L97–103)
- **Decoradores:** `@Get('sessions/:id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.getSession.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialDayReviewController.snapshot`

- **Firma:** `snapshot(id: string, dto: CorrectSnapshotRequestDto, user: RequestUser)` — [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L105) (L105–125)
- **Decoradores:** `@Post('sessions/:id/snapshot-corrections')` `@Roles('SUPER_ADMIN')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.correctSnapshot.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialDayReviewController.movement`

- **Firma:** `movement(id: string, dto: AdjustMovementRequestDto, user: RequestUser)` — [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L127) (L127–146)
- **Decoradores:** `@Post('sessions/:id/movement-adjustments')` `@Roles('SUPER_ADMIN')` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.adjustMovement.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialDayReviewController.closeRequest`

- **Firma:** `closeRequest(id: string, user: RequestUser)` — [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L148) (L148–160)
- **Decoradores:** `@Post('sessions/:id/close-request')` `@Roles('SUPER_ADMIN')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.requestClose.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `FinancialDayReviewController.close`

- **Firma:** `close(id: string, dto: CloseFinancialDayReviewRequestDto, user: RequestUser)` — [financial-day-review.controller.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts#L162) (L162–177)
- **Decoradores:** `@Post('sessions/:id/close')` `@Roles('SUPER_ADMIN')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser() user`
- **Dependencias (llamadas en su cuerpo):** `this.closeReview.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-financial-day-review-presentation-dtos-financial-day-review-request-dto-ts"></a>

### financial-day-review.request.dto.ts

- **Ruta:** [financial-day-review.request.dto.ts](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/dtos/financial-day-review.request.dto.ts) (`comercial-jhoel-api/src/modules/financial-day-review/presentation/dtos/financial-day-review.request.dto.ts`, 125 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `financial-day-review`
- **Responsabilidad:** Calendar range (inclusive, ISO dates).
- **Depende de (archivos del proyecto):** [financial-day-review.repository.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-domain-repositories-financial-day-review-repository-ts)
- **Paquetes externos:** `class-validator`
- **Consumidores:** [financial-day-review.controller.ts](financial-day-review.md#f-comercial-jhoel-api-src-modules-financial-day-review-presentation-controllers-financial-day-review-controller-ts)

#### Clase `ListFinancialDaysQueryDto` (L24–30)

- **Propósito:** Calendar range (inclusive, ISO dates).

#### Clase `ListCorrectionsQueryDto` (L33–41)

- **Propósito:** Audit trail filter: one day and/or one session.

#### Clase `OpenFinancialDayReviewRequestDto` (L44–57)

- **Propósito:** "ABRIR DÍA PARA REVISIÓN": explicit confirmation + mandatory reason.

#### Clase `CorrectionBaseDto` (L60–78)

- **Propósito:** Shared fields of every correction (reason, notes, idempotency key).

#### Clase `CorrectSnapshotRequestDto` (L81–96)

- **Herencia / contratos:** extends CorrectionBaseDto
- **Propósito:** Correct a day-owned snapshot value (bank day balance, cuadre total, count, …).

#### Clase `AdjustMovementRequestDto` (L99–110)

- **Herencia / contratos:** extends CorrectionBaseDto
- **Propósito:** Correct a movement's amount through a linked adjustment.

#### Clase `CloseFinancialDayReviewRequestDto` (L113–124)

- **Propósito:** Final confirmation of the review close.
