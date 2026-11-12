# Control de Efectivo: apertura del día operativo de efectivo

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`post-cash-control-days-open.mmd`](post-cash-control-days-open.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Control de Efectivo: apertura del día operativo de efectivo"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CashControlService.openDay<br/><small>app/core/services/cash-control.service.ts</small>"]
  n6["CashCutControlPanelComponent.openDay<br/><small>app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/cash-control/days/open<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿OpenCashDayRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["CashControlController.openDay<br/><small>api/cash-control/presentation/controllers/cash-control.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["OpenCashDayUseCase.execute<br/><small>api/cash-control/application/use-cases/cash-cut-commands.use-cases.ts</small>"]
  n19["assertCutManager()<br/><small>llamada en L58</small><br/><small>api/cash-control/application/use-cases/cash-cut-commands.use-cases.ts</small>"]
  n20{"¿!(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(role)?<br/><small>L25</small>"}
  n21(["cashControlError('CASH_FORBIDDEN')"])
  n22{"¿!isCashAdmin(input.role)?<br/><small>L61</small>"}
  n23(["cashControlError('CASH_MANUAL_OPENING_FORBIDDEN')"])
  n24{"¿!Number.isFinite(manual) #124;#124; manual #lt; 0?<br/><small>L64</small>"}
  n25(["cashControlError('CASH_INVALID_AMOUNT')"])
  n26["assertCutSchedule()<br/><small>llamada en L76</small><br/><small>api/cash-control/domain/policies/cash-control.policy.ts</small>"]
  n27{"¿!isValidCutTime(start) #124;#124; !isValidCutTime(end) #124;#124; minutes(end) #lt;= minutes(start)?<br/><small>L72</small>"}
  n28(["cashControlError('CASH_CUT_INVALID_SCHEDULE')"])
  n29{"¿overlaps?<br/><small>L86</small>"}
  n30(["cashControlError('CASH_CUT_SCHEDULE_OVERLAP')"])
  n31{"¿times.some((time) =#gt; time)?<br/><small>L81</small>"}
  n32(["cashControlError('CASH_CUT_INVALID_SCHEDULE')"])
  end
  n33["Caso de uso GetCashPositionUseCase<br/><small>execute</small>"]
  subgraph s34["Dominio → Infraestructura"]
  n35["Puerto CashControlRepository.openDay<br/>@Inject(CASH_CONTROL_REPOSITORY)"]
  n36["TypeOrmCashControlRepository<br/><small>api/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts</small>"]
  subgraph s37["PostgreSQL — función open_cash_operational_day"]
  n38[["SELECT open_cash_operational_day(…)<br/><small>openDay — una transacción</small>"]]
  n39{"¿EXISTS (SELECT 1 FROM cash_cut_periods WHERE status = 'ABIERTO')?"}
  n40(["RAISE CASH_CUT_ANOTHER_OPEN<br/>(rollback)"])
  n41{"¿v_second_start #lt; v_first_end?"}
  n42(["RAISE CASH_CUT_SCHEDULE_OVERLAP<br/>(rollback)"])
  n43{"¿(p_manual_physical IS NOT NULL) y (p_manual_physical #lt; 0)?"}
  n44(["RAISE CASH_INVALID_AMOUNT<br/>(rollback)"])
  n45{"¿p_reason IS NULL OR length(trim(p_reason)) #lt; 5?"}
  n46(["RAISE CASH_REASON_REQUIRED<br/>(rollback)"])
  n47["Otros RAISE de open_cash_operational_day (condición no extraída):<br/>CASH_CUT_INVALID_SCHEDULE, CASH_DAY_LATER_EXISTS"]
  n48[["cash_balance_at()"]]
  n49[("Escribe:<br/>cash_cut_periods<br/>cash_operational_days")]
  end
  end
  n50(["Fin: la interfaz se actualiza"])
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
  n24 -->|sí| n25
  n25 --> n2
  n24 -->|no| n26
  n26 --> n27
  n27 -->|sí| n28
  n28 --> n2
  n27 -->|no| n29
  n29 -->|sí| n30
  n30 --> n2
  n29 -->|no| n31
  n31 -->|sí| n32
  n32 --> n2
  n18 -.->|consulta| n33
  n31 -->|no| n35
  n35 -->|implementa| n36
  n36 -->|openDay| n38
  n38 --> n39
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
  n38 -.->|también puede lanzar| n47
  n47 --> n2
  n45 -->|no · llama| n48
  n45 -->|no| n49
  n49 -->|COMMIT| n8
  n8 --> n50
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
  class n2,n3,n11,n13,n15,n21,n23,n25,n28,n30,n32,n40,n42,n44,n46,n47 err
  class n5,n6,n7 fe
  class n8,n50 ok
  class n10,n12,n14,n20,n22,n24,n27,n29,n31,n39,n41,n43,n45 dec
  class n16 api
  class n18,n33 app
  class n19,n26,n35 dom
  class n36 infra
  class n38,n48,n49 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/cash-control/days/open: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CashCutControlPanelComponent.openDay (comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts), [`comercial-jhoel-app/src/app/core/services/cash-control.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/get-cash-position.use-case.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/get-cash-position.use-case.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO' | DTO OpenCashDayRequestDto | !(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(role) | !isCashAdmin(input.role) | !Number.isFinite(manual) || manual < 0 | !isValidCutTime(start) || !isValidCutTime(end) || minutes(end) <= minutes(start) | overlaps | times.some((time) => time) | SQL open_cash_operational_day: EXISTS (SELECT 1 FROM cash_cut_periods WHERE status = 'ABIERTO') | SQL open_cash_operational_day: v_second_start < v_first_end | SQL open_cash_operational_day: (p_manual_physical IS NOT NULL) y (p_manual_physical < 0) | SQL open_cash_operational_day: p_reason IS NULL OR length(trim(p_reason)) < 5
6. **¿Dónde se almacenan los datos?** open_cash_operational_day(), cash_cut_periods, cash_operational_days
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
