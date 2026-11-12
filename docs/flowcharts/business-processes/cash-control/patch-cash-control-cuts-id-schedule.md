# PATCH /api/cash-control/cuts/:id/schedule

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`patch-cash-control-cuts-id-schedule.mmd`](patch-cash-control-cuts-id-schedule.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta PATCH /api/cash-control/cuts/:id/schedule"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CashControlService.updateSchedule<br/><small>app/core/services/cash-control.service.ts</small>"]
  n6["CashCutControlPanelComponent.onReason<br/><small>app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP PATCH /api/cash-control/cuts/:id/schedule<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿UpdateCashCutScheduleRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["CashControlController.updateSchedule<br/><small>api/cash-control/presentation/controllers/cash-control.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["UpdateCashCutScheduleUseCase.execute<br/><small>api/cash-control/application/use-cases/cash-cut-commands.use-cases.ts</small>"]
  n19["assertCutManager()<br/><small>llamada en L116</small><br/><small>api/cash-control/application/use-cases/cash-cut-commands.use-cases.ts</small>"]
  n20{"¿!(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(role)?<br/><small>L25</small>"}
  n21(["cashControlError('CASH_FORBIDDEN')"])
  n22{"¿!period?<br/><small>L118</small>"}
  n23(["cashControlError('CASH_CUT_NOT_FOUND')"])
  n24["assertCutSchedule()<br/><small>llamada en L125</small><br/><small>api/cash-control/domain/policies/cash-control.policy.ts</small>"]
  n25{"¿!isValidCutTime(start) #124;#124; !isValidCutTime(end) #124;#124; minutes(end) #lt;= minutes(start)?<br/><small>L72</small>"}
  n26(["cashControlError('CASH_CUT_INVALID_SCHEDULE')"])
  n27{"¿overlaps?<br/><small>L86</small>"}
  n28(["cashControlError('CASH_CUT_SCHEDULE_OVERLAP')"])
  end
  n29["Caso de uso GetCashPositionUseCase<br/><small>execute</small>"]
  subgraph s30["Dominio → Infraestructura"]
  n31["Puerto CashControlRepository.findPeriodById / findPeriodsByDay / updateSchedule<br/>@Inject(CASH_CONTROL_REPOSITORY)"]
  n32["TypeOrmCashControlRepository<br/><small>api/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts</small>"]
  n33[("findPeriodsByDay: TypeORM Repository")]
  n34[("findPeriodById: TypeORM Repository")]
  subgraph s35["PostgreSQL — función update_cash_cut_schedule"]
  n36[["SELECT update_cash_cut_schedule(…)<br/><small>updateSchedule — una transacción</small>"]]
  n37{"¿NOT FOUND?"}
  n38(["RAISE CASH_CUT_NOT_FOUND<br/>(rollback)"])
  n39{"¿v_period.status = 'FINALIZADO'?"}
  n40(["RAISE CASH_CUT_ALREADY_FINISHED<br/>(rollback)"])
  n41{"¿p_reason IS NULL OR length(trim(p_reason)) #lt; 5?"}
  n42(["RAISE CASH_REASON_REQUIRED<br/>(rollback)"])
  n43{"¿p_start IS NULL OR p_end IS NULL OR p_end #lt;= p_start?"}
  n44(["RAISE CASH_CUT_INVALID_SCHEDULE<br/>(rollback)"])
  n45{"¿(v_period.period_number = 1 AND v_new_end #gt; v_sibling.scheduled_start_at) OR (v_period.period_number = 2 AND v_new_start #lt; v_sibling.scheduled_end_at)?"}
  n46(["RAISE CASH_CUT_SCHEDULE_OVERLAP<br/>(rollback)"])
  n47[["cash_guatemala_ts()"]]
  n48[("Escribe:<br/>cash_cut_periods<br/>cash_cut_schedule_changes")]
  end
  end
  n49(["Fin: la interfaz se actualiza"])
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
  n22 -->|no| n24
  n24 --> n25
  n25 -->|sí| n26
  n26 --> n2
  n25 -->|no| n27
  n27 -->|sí| n28
  n28 --> n2
  n18 -.->|consulta| n29
  n27 -->|no| n31
  n31 -->|implementa| n32
  n32 --> n33
  n33 --> n8
  n32 --> n34
  n34 --> n8
  n32 -->|updateSchedule| n36
  n36 --> n37
  n37 -->|sí| n38
  n38 --> n2
  n37 -->|no| n39
  n39 -->|sí| n40
  n40 --> n2
  n39 -->|no| n41
  n41 -->|sí| n42
  n42 --> n2
  n41 -->|no| n43
  n43 -->|sí| n44
  n44 --> n2
  n43 -->|no| n45
  n45 -->|sí| n46
  n46 --> n2
  n45 -->|no · llama| n47
  n45 -->|no| n48
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
  class n2,n3,n11,n13,n15,n21,n23,n26,n28,n38,n40,n42,n44,n46 err
  class n5,n6,n7 fe
  class n8,n49 ok
  class n10,n12,n14,n20,n22,n25,n27,n37,n39,n41,n43,n45 dec
  class n16 api
  class n18,n29 app
  class n19,n24,n31 dom
  class n32 infra
  class n33,n34,n36,n47,n48 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de PATCH /api/cash-control/cuts/:id/schedule: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CashCutControlPanelComponent.onReason (comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts), [`comercial-jhoel-app/src/app/core/services/cash-control.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/get-cash-position.use-case.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/get-cash-position.use-case.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO' | DTO UpdateCashCutScheduleRequestDto | !(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(role) | !period | !isValidCutTime(start) || !isValidCutTime(end) || minutes(end) <= minutes(start) | overlaps | SQL update_cash_cut_schedule: NOT FOUND | SQL update_cash_cut_schedule: v_period.status = 'FINALIZADO' | SQL update_cash_cut_schedule: p_reason IS NULL OR length(trim(p_reason)) < 5 | SQL update_cash_cut_schedule: p_start IS NULL OR p_end IS NULL OR p_end <= p_start | SQL update_cash_cut_schedule: (v_period.period_number = 1 AND v_new_end > v_sibling.scheduled_start_at) OR (v_period.period_number = 2 AND v_new_start < v_sibling.scheduled_end_at)
6. **¿Dónde se almacenan los datos?** update_cash_cut_schedule(), cash_cut_periods, cash_cut_schedule_changes
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
