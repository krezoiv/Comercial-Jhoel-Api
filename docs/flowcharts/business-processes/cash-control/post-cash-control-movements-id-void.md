# POST /api/cash-control/movements/:id/void

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`post-cash-control-movements-id-void.mmd`](post-cash-control-movements-id-void.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/cash-control/movements/:id/void"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CashControlService.voidMovement<br/><small>app/core/services/cash-control.service.ts</small>"]
  n6["CashControlPageComponent.voidMovement<br/><small>app/features/dashboard/cash-control/cash-control-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/cash-control/movements/:id/void<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('SUPER_ADMIN', 'ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿ReasonRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["CashControlController.voidMovement<br/><small>api/cash-control/presentation/controllers/cash-control.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["VoidCashMovementUseCase.execute<br/><small>api/cash-control/application/use-cases/cash-movement-commands.use-cases.ts</small>"]
  n19{"¿!isCashAdmin(input.role)?<br/><small>L105</small>"}
  n20(["cashControlError('CASH_FORBIDDEN')"])
  n21{"¿!movement?<br/><small>L117</small>"}
  n22(["cashControlError('CASH_MOVEMENT_NOT_FOUND')"])
  end
  subgraph s23["Dominio → Infraestructura"]
  n24["Puerto CashControlRepository.voidManualMovement / findMovementById / getBalance<br/>@Inject(CASH_CONTROL_REPOSITORY)"]
  n25["TypeOrmCashControlRepository<br/><small>api/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts</small>"]
  n26[("getBalance: SQL / TypeORM sobre<br/>cash_movements")]
  n27[("findMovementById: SQL / TypeORM sobre<br/>cash_movement_details")]
  subgraph s28["PostgreSQL — función void_manual_cash_movement"]
  n29[["SELECT void_manual_cash_movement(…)<br/><small>voidManualMovement — una transacción</small>"]]
  n30{"¿p_reason IS NULL OR length(trim(p_reason)) #lt; 5?"}
  n31(["RAISE CASH_REASON_REQUIRED<br/>(rollback)"])
  n32{"¿NOT FOUND?"}
  n33(["RAISE CASH_MOVEMENT_NOT_FOUND<br/>(rollback)"])
  n34["Otros RAISE de void_manual_cash_movement (condición no extraída):<br/>CASH_MOVEMENT_NOT_VOIDABLE"]
  n35[["void_cash_warehouse_transfer()"]]
  n36[["void_warehouse_withdrawal()"]]
  end
  end
  n37(["Fin: la interfaz se actualiza<br/>this.voiding.set<br/>this.voidTarget.set<br/>this.notifications.success<br/>this.notifications.error"])
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
  n19 -->|no| n21
  n21 -->|sí| n22
  n22 --> n2
  n21 -->|no| n24
  n24 -->|implementa| n25
  n25 --> n26
  n26 --> n8
  n25 --> n27
  n27 --> n8
  n25 -->|voidManualMovement| n29
  n29 --> n30
  n30 -->|sí| n31
  n31 --> n2
  n30 -->|no| n32
  n32 -->|sí| n33
  n33 --> n2
  n29 -.->|también puede lanzar| n34
  n34 --> n2
  n32 -->|no · llama| n35
  n32 -->|no · llama| n36
  n32 -->|no| n8
  n8 --> n37
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
  class n2,n3,n11,n13,n15,n20,n22,n31,n33,n34 err
  class n5,n6,n7 fe
  class n8,n37 ok
  class n10,n12,n14,n19,n21,n30,n32 dec
  class n16 api
  class n18 app
  class n24 dom
  class n25 infra
  class n26,n27,n29,n35,n36 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/cash-control/movements/:id/void: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CashControlPageComponent.voidMovement (comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts), [`comercial-jhoel-app/src/app/core/services/cash-control.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/cash-control-page.component.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-commands.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-commands.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'SUPER_ADMIN', 'ADMIN' | DTO ReasonRequestDto | !isCashAdmin(input.role) | !movement | SQL void_manual_cash_movement: p_reason IS NULL OR length(trim(p_reason)) < 5 | SQL void_manual_cash_movement: NOT FOUND
6. **¿Dónde se almacenan los datos?** void_manual_cash_movement(), cash_movements, cash_movement_details
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
