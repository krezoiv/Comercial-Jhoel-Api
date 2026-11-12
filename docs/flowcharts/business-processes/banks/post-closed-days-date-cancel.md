# POST /api/closed-days/:date/cancel

Módulo: **Bancos y Agentes Bancarios (día, saldos, cuadre, transferencias) (banks)** · Fuente editable: [`post-closed-days-date-cancel.mmd`](post-closed-days-date-cancel.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/closed-days/:date/cancel"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["ClosedDaysService.cancelDay<br/><small>app/core/services/closed-days.service.ts</small>"]
  n6["ClosedDaysPageComponent.confirmCancel<br/><small>app/features/dashboard/closed-days/closed-days-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["TransactionDaysPageComponent.confirmCancel<br/><small>app/features/dashboard/transaction-days/transaction-days-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n8["HTTP POST /api/closed-days/:date/cancel<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n9["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s10["API NestJS — presentación"]
  n11{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n12(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n13{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n14(["403 Sin permisos"])
  n15{"¿DayActionReasonRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n16(["400 Datos inválidos"])
  n17["ClosedDaysController.cancel<br/><small>api/banks/presentation/controllers/closed-days.controller.ts</small>"]
  end
  subgraph s18["Aplicación — caso de uso"]
  n19["CancelDayUseCase.execute<br/><small>api/banks/application/use-cases/cancel-day.use-case.ts</small>"]
  n20{"¿!reason?<br/><small>L31</small>"}
  n21(["CancelReasonRequiredError()"])
  end
  n22["Caso de uso GetDayDetailUseCase<br/><small>execute</small>"]
  subgraph s23["Dominio → Infraestructura"]
  n24["Puerto DayOpeningRepository.cancel<br/>@Inject(DAY_OPENING_REPOSITORY)"]
  n25["TypeOrmDayOpeningRepository<br/><small>api/banks/infrastructure/persistence/typeorm-day-opening.repository.ts</small>"]
  subgraph s26["PostgreSQL — función cancel_agent_day"]
  n27[["SELECT cancel_agent_day(…)<br/><small>cancel — una transacción</small>"]]
  n28{"¿p_reason IS NULL OR btrim(p_reason) = ''?"}
  n29(["RAISE CANCEL_REASON_REQUIRED<br/>(rollback)"])
  n30{"¿NOT FOUND?"}
  n31(["RAISE DAY_NOT_FOUND<br/>(rollback)"])
  n32{"¿v_day.is_cancelled?"}
  n33(["RAISE DAY_ALREADY_CANCELLED<br/>(rollback)"])
  n34{"¿v_day.closed_at IS NULL?"}
  n35(["RAISE DAY_NOT_CLOSED<br/>(rollback)"])
  n36{"¿v_later_count #gt; 0?"}
  n37(["RAISE LATER_DAY_EXISTS<br/>(rollback)"])
  n38[("Escribe:<br/>day_audit_logs<br/>day_openings")]
  end
  end
  n39(["Fin: la interfaz se actualiza<br/>this.isSavingAction.set<br/>this.isCancelModalOpen.set<br/>this.notificationService.success<br/>this.notificationService.error"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n1 -->|acción del usuario| n7
  n7 --> n5
  n5 --> n8
  n8 --> n11
  n11 -->|no| n12
  n12 --> n3
  n11 -->|sí| n13
  n13 -->|no| n14
  n14 --> n2
  n13 -->|sí| n15
  n15 -->|no| n16
  n16 --> n2
  n15 -->|sí| n17
  n17 --> n19
  n19 --> n20
  n20 -->|sí| n21
  n21 --> n2
  n19 -.->|consulta| n22
  n20 -->|no| n24
  n24 -->|implementa| n25
  n25 -->|cancel| n27
  n27 --> n28
  n28 -->|sí| n29
  n29 --> n2
  n28 -->|no| n30
  n30 -->|sí| n31
  n31 --> n2
  n30 -->|no| n32
  n32 -->|sí| n33
  n33 --> n2
  n32 -->|no| n34
  n34 -->|sí| n35
  n35 --> n2
  n34 -->|no| n36
  n36 -->|sí| n37
  n37 --> n2
  n36 -->|no| n38
  n38 -->|COMMIT| n9
  n9 --> n39
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
  class n2,n3,n12,n14,n16,n21,n29,n31,n33,n35,n37 err
  class n5,n6,n7,n8 fe
  class n9,n39 ok
  class n11,n13,n15,n20,n28,n30,n32,n34,n36 dec
  class n17 api
  class n19,n22 app
  class n24 dom
  class n25 infra
  class n27,n38 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/closed-days/:date/cancel: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** ClosedDaysPageComponent.confirmCancel (comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts`](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/closed-days.controller.ts), [`comercial-jhoel-app/src/app/core/services/closed-days.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/closed-days.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/closed-days/closed-days-page.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/transaction-days/transaction-days-page.component.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/cancel-day.use-case.ts`](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/cancel-day.use-case.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/get-day-detail.use-case.ts`](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/get-day-detail.use-case.ts), [`comercial-jhoel-api/src/modules/banks/domain/repositories/day-opening.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/day-opening.repository.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO DayActionReasonRequestDto | !reason | SQL cancel_agent_day: p_reason IS NULL OR btrim(p_reason) = '' | SQL cancel_agent_day: NOT FOUND | SQL cancel_agent_day: v_day.is_cancelled | SQL cancel_agent_day: v_day.closed_at IS NULL | SQL cancel_agent_day: v_later_count > 0
6. **¿Dónde se almacenan los datos?** cancel_agent_day(), day_audit_logs, day_openings
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
