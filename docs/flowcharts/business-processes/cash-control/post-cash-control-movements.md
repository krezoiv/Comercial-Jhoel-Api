# Control de Efectivo: entrada / salida / ajuste manual

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`post-cash-control-movements.mmd`](post-cash-control-movements.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Control de Efectivo: entrada / salida / ajuste manual"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CashControlService.registerMovement<br/><small>app/core/services/cash-control.service.ts</small>"]
  n6["CashMovementFormModalComponent.save<br/><small>app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/cash-control/movements<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿RegisterCashMovementRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["CashControlController.registerMovement<br/><small>api/cash-control/presentation/controllers/cash-control.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["RegisterCashMovementUseCase.execute<br/><small>api/cash-control/application/use-cases/cash-movement-commands.use-cases.ts</small>"]
  n19{"¿(input.movementType === 'AJUSTE' #124;#124; input.movementType === 'SALDO_INICIAL') #amp;#amp; !isCashAdmin(input.role)?<br/><small>L47</small>"}
  n20(["cashControlError('CASH_FORBIDDEN')"])
  n21{"¿!Number.isFinite(amount) #124;#124; amount === 0 #124;#124; (input.movementType !== 'AJUSTE' #amp;#amp; amount #lt; 0)?<br/><small>L55</small>"}
  n22(["cashControlError('CASH_INVALID_AMOUNT')"])
  end
  subgraph s23["Dominio → Infraestructura"]
  n24["Puerto CashControlRepository.registerManualMovement / findMovementById / getBalance<br/>@Inject(CASH_CONTROL_REPOSITORY)"]
  n25["TypeOrmCashControlRepository<br/><small>api/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts</small>"]
  n26[("getBalance: SQL / TypeORM sobre<br/>cash_movements")]
  n27[("findMovementById: SQL / TypeORM sobre<br/>cash_movement_details")]
  subgraph s28["PostgreSQL — función register_manual_cash_movement"]
  n29[["SELECT register_manual_cash_movement(…)<br/><small>registerManualMovement — una transacción</small>"]]
  n30{"¿p_movement_type NOT IN ('ENTRADA_MANUAL', 'SALIDA_MANUAL', 'AJUSTE', 'SALDO_INICIAL')?"}
  n31(["RAISE CASH_INVALID_MOVEMENT_TYPE<br/>(rollback)"])
  n32{"¿p_amount IS NULL OR p_amount = 0?"}
  n33(["RAISE CASH_INVALID_AMOUNT<br/>(rollback)"])
  n34{"¿p_movement_type IN ('ENTRADA_MANUAL', 'SALIDA_MANUAL', 'SALDO_INICIAL') AND p_amount #lt; 0?"}
  n35(["RAISE CASH_INVALID_AMOUNT<br/>(rollback)"])
  n36{"¿p_reason IS NULL OR length(trim(p_reason)) #lt; 5?"}
  n37(["RAISE CASH_REASON_REQUIRED<br/>(rollback)"])
  n38{"¿p_movement_type = 'SALDO_INICIAL' AND EXISTS ( SELECT 1 FROM cash_movements WHERE movement_type = 'SALDO_INICIAL' AND status = 'VIGENTE' AND idempotency_key #lt;#gt; ?"}
  n39(["RAISE CASH_INITIAL_BALANCE_EXISTS<br/>(rollback)"])
  end
  end
  n40(["Fin: la interfaz se actualiza<br/>this.isSaving.set<br/>this.errorMessage.set<br/>this.notifications.success<br/>this.saved.emit"])
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
  n25 -->|registerManualMovement| n29
  n29 --> n30
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
  n38 -->|sí| n39
  n39 --> n2
  n38 -->|no| n8
  n8 --> n40
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
  class n2,n3,n11,n13,n15,n20,n22,n31,n33,n35,n37,n39 err
  class n5,n6,n7 fe
  class n8,n40 ok
  class n10,n12,n14,n19,n21,n30,n32,n34,n36,n38 dec
  class n16 api
  class n18 app
  class n24 dom
  class n25 infra
  class n26,n27,n29 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/cash-control/movements: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CashMovementFormModalComponent.save (comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts), [`comercial-jhoel-app/src/app/core/services/cash-control.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-commands.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-commands.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO' | DTO RegisterCashMovementRequestDto | (input.movementType === 'AJUSTE' || input.movementType === 'SALDO_INICIAL') && !isCashAdmin(input.role) | !Number.isFinite(amount) || amount === 0 || (input.movementType !== 'AJUSTE' && amount < 0) | SQL register_manual_cash_movement: p_movement_type NOT IN ('ENTRADA_MANUAL', 'SALIDA_MANUAL', 'AJUSTE', 'SALDO_INICIAL') | SQL register_manual_cash_movement: p_amount IS NULL OR p_amount = 0 | SQL register_manual_cash_movement: p_movement_type IN ('ENTRADA_MANUAL', 'SALIDA_MANUAL', 'SALDO_INICIAL') AND p_amount < 0 | SQL register_manual_cash_movement: p_reason IS NULL OR length(trim(p_reason)) < 5 | SQL register_manual_cash_movement: p_movement_type = 'SALDO_INICIAL' AND EXISTS ( SELECT 1 FROM cash_movements WHERE movement_type = 'SALDO_INICIAL' AND status = 'VIGENTE' AND idempotency_key <> 
6. **¿Dónde se almacenan los datos?** register_manual_cash_movement(), cash_movements, cash_movement_details
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
