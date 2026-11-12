# POST /api/recharge-days/:date/cancel

Módulo: **Recargas electrónicas (recharges)** · Fuente editable: [`post-recharge-days-date-cancel.mmd`](post-recharge-days-date-cancel.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/recharge-days/:date/cancel"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["RechargeDaysService.cancelDay<br/><small>app/core/services/recharge-days.service.ts</small>"]
  n6["RechargeDaysPageComponent.confirmCancel<br/><small>app/features/dashboard/recharge-days/recharge-days-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/recharge-days/:date/cancel<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿RechargeDayActionReasonRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["RechargeDaysController.cancel<br/><small>api/recharges/presentation/controllers/recharge-days.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["CancelRechargeDayUseCase.execute<br/><small>api/recharges/application/use-cases/cancel-recharge-day.use-case.ts</small>"]
  n19{"¿!reason?<br/><small>L34</small>"}
  n20(["RechargeCancelReasonRequiredError()"])
  end
  n21["Caso de uso GetRechargeDayDetailUseCase<br/><small>execute</small>"]
  subgraph s22["Dominio → Infraestructura"]
  n23["Puerto RechargeDayOpeningRepository.cancel<br/>@Inject(RECHARGE_DAY_OPENING_REPOSITORY)"]
  n24["TypeOrmRechargeDayOpeningRepository<br/><small>api/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts</small>"]
  subgraph s25["PostgreSQL — función cancel_recharge_day"]
  n26[["SELECT cancel_recharge_day(…)<br/><small>cancel — una transacción</small>"]]
  n27{"¿p_reason IS NULL OR btrim(p_reason) = ''?"}
  n28(["RAISE RECHARGE_CANCEL_REASON_REQUIRED<br/>(rollback)"])
  n29{"¿NOT FOUND?"}
  n30(["RAISE RECHARGE_DAY_NOT_FOUND<br/>(rollback)"])
  n31{"¿v_day.is_cancelled?"}
  n32(["RAISE RECHARGE_DAY_ALREADY_CANCELLED<br/>(rollback)"])
  n33{"¿v_day.closed_at IS NULL?"}
  n34(["RAISE RECHARGE_DAY_NOT_CLOSED<br/>(rollback)"])
  n35{"¿v_later_count #gt; 0?"}
  n36(["RAISE RECHARGE_LATER_DAY_EXISTS<br/>(rollback)"])
  n37[("Escribe:<br/>recharge_day_audit_logs<br/>recharge_day_openings")]
  end
  end
  n38(["Fin: la interfaz se actualiza<br/>this.isSavingAction.set<br/>this.isCancelModalOpen.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n19 -->|sí| n20
  n20 --> n2
  n18 -.->|consulta| n21
  n19 -->|no| n23
  n23 -->|implementa| n24
  n24 -->|cancel| n26
  n26 --> n27
  n27 -->|sí| n28
  n28 --> n2
  n27 -->|no| n29
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
  n37 -->|COMMIT| n8
  n8 --> n38
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
  class n2,n3,n11,n13,n15,n20,n28,n30,n32,n34,n36 err
  class n5,n6,n7 fe
  class n8,n38 ok
  class n10,n12,n14,n19,n27,n29,n31,n33,n35 dec
  class n16 api
  class n18,n21 app
  class n23 dom
  class n24 infra
  class n26,n37 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/recharge-days/:date/cancel: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** RechargeDaysPageComponent.confirmCancel (comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts`](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-days.controller.ts), [`comercial-jhoel-app/src/app/core/services/recharge-days.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/recharge-days.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/recharge-days/recharge-days-page.component.ts), [`comercial-jhoel-api/src/modules/recharges/application/use-cases/cancel-recharge-day.use-case.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/cancel-recharge-day.use-case.ts), [`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-day-detail.use-case.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-day-detail.use-case.ts), [`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-day-opening.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-day-opening.repository.ts), [`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO RechargeDayActionReasonRequestDto | !reason | SQL cancel_recharge_day: p_reason IS NULL OR btrim(p_reason) = '' | SQL cancel_recharge_day: NOT FOUND | SQL cancel_recharge_day: v_day.is_cancelled | SQL cancel_recharge_day: v_day.closed_at IS NULL | SQL cancel_recharge_day: v_later_count > 0
6. **¿Dónde se almacenan los datos?** cancel_recharge_day(), recharge_day_audit_logs, recharge_day_openings
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
