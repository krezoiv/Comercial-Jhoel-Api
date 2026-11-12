# POST /api/cash-control/days/:id/close

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`post-cash-control-days-id-close.mmd`](post-cash-control-days-id-close.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/cash-control/days/:id/close"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CashControlService.closeDay<br/><small>app/core/services/cash-control.service.ts</small>"]
  n6["CashCutControlPanelComponent.closeDay<br/><small>app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/cash-control/days/:id/close<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿CloseCashDayRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["CashControlController.closeDay<br/><small>api/cash-control/presentation/controllers/cash-control.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["CloseCashDayUseCase.execute<br/><small>api/cash-control/application/use-cases/cash-cut-commands.use-cases.ts</small>"]
  n19["assertCutManager()<br/><small>llamada en L284</small><br/><small>api/cash-control/application/use-cases/cash-cut-commands.use-cases.ts</small>"]
  n20{"¿!(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(role)?<br/><small>L25</small>"}
  n21(["cashControlError('CASH_FORBIDDEN')"])
  n22{"¿!day?<br/><small>L286</small>"}
  n23(["cashControlError('CASH_DAY_NOT_FOUND')"])
  end
  n24["Caso de uso GetCashPositionUseCase<br/><small>execute</small>"]
  subgraph s25["Dominio → Infraestructura"]
  n26["Puerto CashControlRepository.findDayById / closeDay<br/>@Inject(CASH_CONTROL_REPOSITORY)"]
  n27["TypeOrmCashControlRepository<br/><small>api/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts</small>"]
  n28[("findDayById: TypeORM Repository")]
  subgraph s29["PostgreSQL — función close_cash_operational_day"]
  n30[["SELECT close_cash_operational_day(…)<br/><small>closeDay — una transacción</small>"]]
  n31{"¿NOT FOUND?"}
  n32(["RAISE CASH_DAY_NOT_FOUND<br/>(rollback)"])
  n33{"¿v_day.status = 'CERRADO'?"}
  n34(["RAISE CASH_DAY_ALREADY_CLOSED<br/>(rollback)"])
  n35{"¿EXISTS ( SELECT 1 FROM cash_cut_periods WHERE operational_day_id = p_day_id AND status #lt;#gt; 'FINALIZADO' )?"}
  n36(["RAISE CASH_DAY_CUTS_PENDING<br/>(rollback)"])
  n37[("Escribe:<br/>cash_operational_days")]
  end
  end
  n38(["Fin: la interfaz se actualiza"])
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
  n18 -.->|consulta| n24
  n22 -->|no| n26
  n26 -->|implementa| n27
  n27 --> n28
  n28 --> n8
  n27 -->|closeDay| n30
  n30 --> n31
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
  class n2,n3,n11,n13,n15,n21,n23,n32,n34,n36 err
  class n5,n6,n7 fe
  class n8,n38 ok
  class n10,n12,n14,n20,n22,n31,n33,n35 dec
  class n16 api
  class n18,n24 app
  class n19,n26 dom
  class n27 infra
  class n28,n30,n37 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/cash-control/days/:id/close: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CashCutControlPanelComponent.closeDay (comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts), [`comercial-jhoel-app/src/app/core/services/cash-control.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/get-cash-position.use-case.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/get-cash-position.use-case.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO' | DTO CloseCashDayRequestDto | !(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(role) | !day | SQL close_cash_operational_day: NOT FOUND | SQL close_cash_operational_day: v_day.status = 'CERRADO' | SQL close_cash_operational_day: EXISTS ( SELECT 1 FROM cash_cut_periods WHERE operational_day_id = p_day_id AND status <> 'FINALIZADO' )
6. **¿Dónde se almacenan los datos?** close_cash_operational_day(), cash_operational_days
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
