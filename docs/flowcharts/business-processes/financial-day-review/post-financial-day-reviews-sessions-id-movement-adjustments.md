# POST /api/financial-day-reviews/sessions/:id/movement-adjustments

Módulo: **Revisión de días operativos (financial-day-review)** · Fuente editable: [`post-financial-day-reviews-sessions-id-movement-adjustments.mmd`](post-financial-day-reviews-sessions-id-movement-adjustments.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/financial-day-reviews/sessions/:id/movement-adjustments"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["FinancialDayReviewService.adjustMovement<br/><small>app/core/services/financial-day-review.service.ts</small>"]
  n6["FinancialDayReviewPageComponent.confirmCorrection<br/><small>app/features/dashboard/financial-day-review/financial-day-review-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/financial-day-reviews/sessions/:id/movement-adjustments<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿AdjustMovementRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["FinancialDayReviewController.movement<br/><small>api/financial-day-review/presentation/controllers/financial-day-review.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["AdjustFinancialDayMovementUseCase.execute<br/><small>api/financial-day-review/application/use-cases/financial-day-review.use-cases.ts</small>"]
  n19["assertPermission()<br/><small>llamada en L232</small><br/><small>api/financial-day-review/application/use-cases/financial-day-review.use-cases.ts</small>"]
  n20{"¿!hasFinancialDayPermission(role, permission)?<br/><small>L33</small>"}
  n21(["financialDayReviewError('FINANCIAL_REVIEW_FORBIDDEN')"])
  n22{"¿!(MOVEMENT_SOURCES as readonly string[]).includes(input.source)?<br/><small>L233</small>"}
  n23(["financialDayReviewError('FINANCIAL_REVIEW_INVALID_TARGET')"])
  end
  subgraph s24["Dominio → Infraestructura"]
  n25["Puerto FinancialDayReviewRepository.adjustMovement<br/>@Inject(FINANCIAL_DAY_REVIEW_REPOSITORY)"]
  n26["TypeOrmFinancialDayReviewRepository<br/><small>api/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts</small>"]
  subgraph s27["PostgreSQL — función adjust_financial_day_movement"]
  n28[["SELECT adjust_financial_day_movement(…)<br/><small>adjustMovement — una transacción</small>"]]
  n29{"¿v_row.status #lt;#gt; 'VIGENTE' OR v_row.movement_type = 'ANULACION'?"}
  n30(["RAISE FINANCIAL_REVIEW_MOVEMENT_NOT_ADJUSTABLE<br/>(rollback)"])
  n31{"¿v_row.status #lt;#gt; 'APLICADO' OR v_row.movement_type = 'ANULACION'?"}
  n32(["RAISE FINANCIAL_REVIEW_MOVEMENT_NOT_ADJUSTABLE<br/>(rollback)"])
  n33{"¿v_row.reference_type = 'BANK_DEPOSIT'?"}
  n34(["RAISE FINANCIAL_REVIEW_MOVEMENT_HAS_SOURCE<br/>(rollback)"])
  n35{"¿v_row.is_voided?"}
  n36(["RAISE FINANCIAL_REVIEW_MOVEMENT_NOT_ADJUSTABLE<br/>(rollback)"])
  n37{"¿NOT v_row.is_active?"}
  n38(["RAISE FINANCIAL_REVIEW_MOVEMENT_NOT_ADJUSTABLE<br/>(rollback)"])
  n39{"¿v_row_date IS DISTINCT FROM v_session.review_date?"}
  n40(["RAISE FINANCIAL_REVIEW_OUTSIDE_DAY<br/>(rollback)"])
  n41{"¿v_current = p_corrected_amount?"}
  n42(["RAISE FINANCIAL_REVIEW_NO_CHANGE<br/>(rollback)"])
  n43["Otros RAISE de adjust_financial_day_movement (condición no extraída):<br/>FINANCIAL_REVIEW_INVALID_TARGET, FINANCIAL_REVIEW_INVALID_VALUE, FINANCIAL_REVIEW_TARGET_NOT_FOUND"]
  n44[["financial_review_assert_role()"]]
  n45[["financial_review_existing_request()"]]
  n46[["financial_review_lock_session()"]]
  n47[["financial_review_validate_request()"]]
  n48[("Escribe:<br/>financial_day_adjustment_effects<br/>financial_day_adjustments<br/>financial_day_corrections<br/>financial_day_review_sessions")]
  end
  end
  n49(["Fin: la interfaz se actualiza<br/>this.saving.set<br/>this.modalError.set<br/>this.correctionRequest.set<br/>this.notifications.success"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n5 --> n7
  n7 --> n10
  n10 -->|no| n11
  n11 --> n3
  n10 -->|sí| n12
  n12 -->|no| n13
  n13 --> n2
  n12 -->|sí| n14
  n14 -->|no| n15
  n15 --> n2
  n14 -->|sí| n16
  n16 --> n18
  n18 --> n19
  n19 --> n20
  n20 -->|sí| n21
  n21 --> n2
  n20 -->|no| n22
  n22 -->|sí| n23
  n23 --> n2
  n22 -->|no| n25
  n25 -->|implementa| n26
  n26 -->|adjustMovement| n28
  n28 --> n29
  n29 -->|sí| n30
  n30 --> n2
  n29 -->|no| n31
  n31 -->|sí| n32
  n32 --> n2
  n31 -->|no| n33
  n33 -->|sí| n34
  n34 --> n2
  n33 -->|no| n35
  n35 -->|sí| n36
  n36 --> n2
  n35 -->|no| n37
  n37 -->|sí| n38
  n38 --> n2
  n37 -->|no| n39
  n39 -->|sí| n40
  n40 --> n2
  n39 -->|no| n41
  n41 -->|sí| n42
  n42 --> n2
  n28 -.->|también puede lanzar| n43
  n43 --> n2
  n41 -->|no · llama| n44
  n41 -->|no · llama| n45
  n41 -->|no · llama| n46
  n41 -->|no · llama| n47
  n41 -->|no| n48
  n48 -->|COMMIT| n8
  n8 --> n49
  classDef start fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20
  classDef fe fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
  classDef api fill:#ede7f6,stroke:#4527a0,color:#311b92
  classDef app fill:#e0f2f1,stroke:#00695c,color:#004d40
  classDef dom fill:#fff8e1,stroke:#f9a825,color:#5d4037
  classDef infra fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c
  classDef db fill:#eceff1,stroke:#455a64,color:#263238
  classDef dec fill:#fffde7,stroke:#f57f17,color:#3e2723
  classDef err fill:#ffebee,stroke:#c62828,color:#b71c1c
  classDef ok fill:#e8f5e9,stroke:#1b5e20,color:#1b5e20
  class n1 start
  class n2,n3,n11,n13,n15,n21,n23,n30,n32,n34,n36,n38,n40,n42,n43 err
  class n5,n6,n7 fe
  class n8,n49 ok
  class n10,n12,n14,n20,n22,n29,n31,n33,n35,n37,n39,n41 dec
  class n16 api
  class n18 app
  class n19,n25 dom
  class n26 infra
  class n28,n44,n45,n46,n47,n48 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/financial-day-reviews/sessions/:id/movement-adjustments: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** FinancialDayReviewPageComponent.confirmCorrection (comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts`](../../../../comercial-jhoel-api/src/modules/financial-day-review/presentation/controllers/financial-day-review.controller.ts), [`comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/financial-day-review.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/financial-day-review/financial-day-review-page.component.ts), [`comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/financial-day-review/application/use-cases/financial-day-review.use-cases.ts), [`comercial-jhoel-api/src/modules/financial-day-review/domain/repositories/financial-day-review.repository.ts`](../../../../comercial-jhoel-api/src/modules/financial-day-review/domain/repositories/financial-day-review.repository.ts), [`comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts`](../../../../comercial-jhoel-api/src/modules/financial-day-review/infrastructure/persistence/typeorm-financial-day-review.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'SUPER_ADMIN' | DTO AdjustMovementRequestDto | !hasFinancialDayPermission(role, permission) | !(MOVEMENT_SOURCES as readonly string[]).includes(input.source) | SQL adjust_financial_day_movement: v_row.status <> 'VIGENTE' OR v_row.movement_type = 'ANULACION' | SQL adjust_financial_day_movement: v_row.status <> 'APLICADO' OR v_row.movement_type = 'ANULACION' | SQL adjust_financial_day_movement: v_row.reference_type = 'BANK_DEPOSIT' | SQL adjust_financial_day_movement: v_row.is_voided | SQL adjust_financial_day_movement: NOT v_row.is_active | SQL adjust_financial_day_movement: v_row_date IS DISTINCT FROM v_session.review_date | SQL adjust_financial_day_movement: v_current = p_corrected_amount
6. **¿Dónde se almacenan los datos?** adjust_financial_day_movement(), financial_day_adjustment_effects, financial_day_adjustments, financial_day_corrections, financial_day_review_sessions
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
