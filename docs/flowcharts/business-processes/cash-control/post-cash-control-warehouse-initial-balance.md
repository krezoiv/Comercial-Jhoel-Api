# POST /api/cash-control/warehouse/initial-balance

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`post-cash-control-warehouse-initial-balance.mmd`](post-cash-control-warehouse-initial-balance.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/cash-control/warehouse/initial-balance"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CashCustodyService.registerWarehouseInitialBalance<br/><small>app/core/services/cash-custody.service.ts</small>"]
  n6["WarehousePanelComponent.saveInitialBalance<br/><small>app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/cash-control/warehouse/initial-balance<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿WarehouseInitialBalanceRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["CashCustodyController.warehouseInitialBalance<br/><small>api/cash-control/presentation/controllers/cash-custody.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["RegisterWarehouseInitialBalanceUseCase.execute<br/><small>api/cash-control/application/use-cases/cash-custody.use-cases.ts</small>"]
  n17["assertCashCustodyPermission()<br/><small>llamada en L210</small><br/><small>api/cash-control/domain/policies/cash-control.policy.ts</small>"]
  n18{"¿!(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', )?<br/><small>L32</small>"}
  n19(["cashControlError('CASH_CUSTODY_FORBIDDEN')"])
  n20{"¿!input.reason #124;#124; input.reason.trim().length #lt; 5?<br/><small>L211</small>"}
  n21(["cashControlError('CASH_REASON_REQUIRED')"])
  end
  subgraph s22["Dominio → Infraestructura"]
  n23["Puerto CashCustodyRepository.registerWarehouseInitialBalance / getCustody<br/>@Inject(CASH_CUSTODY_REPOSITORY)"]
  n24["TypeOrmCashCustodyRepository<br/><small>api/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts</small>"]
  subgraph s25["PostgreSQL — función cash_balance"]
  n26[["SELECT cash_balance(…)<br/><small>getCustody — una transacción</small>"]]
  end
  subgraph s27["PostgreSQL — función cash_current_bank_day"]
  n28[["SELECT cash_current_bank_day(…)<br/><small>getCustody — una transacción</small>"]]
  end
  subgraph s29["PostgreSQL — función register_warehouse_initial_balance"]
  n30[["SELECT register_warehouse_initial_balance(…)<br/><small>registerWarehouseInitialBalance — una transacción</small>"]]
  n31{"¿p_reason IS NULL OR length(trim(p_reason)) #lt; 5?"}
  n32(["RAISE CASH_REASON_REQUIRED<br/>(rollback)"])
  n33["Otros RAISE de register_warehouse_initial_balance (condición no extraída):<br/>WAREHOUSE_INITIAL_BALANCE_EXISTS"]
  n34[["cash_custody_assert_role()"]]
  end
  end
  n35(["Fin: la interfaz se actualiza<br/>this.savingInitial.set<br/>this.notifications.success<br/>this.changed.emit<br/>this.notifications.error"])
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
  n14 --> n16
  n16 --> n17
  n17 --> n18
  n18 -->|sí| n19
  n19 --> n2
  n18 -->|no| n20
  n20 -->|sí| n21
  n21 --> n2
  n20 -->|no| n23
  n23 -->|implementa| n24
  n24 -->|getCustody| n26
  n26 --> n8
  n24 -->|getCustody| n28
  n28 --> n8
  n24 -->|registerWarehouseInitialBalance| n30
  n30 --> n31
  n31 -->|sí| n32
  n32 --> n2
  n30 -.->|también puede lanzar| n33
  n33 --> n2
  n31 -->|no · llama| n34
  n31 -->|no| n8
  n8 --> n35
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
  class n2,n3,n11,n13,n19,n21,n32,n33 err
  class n5,n6,n7 fe
  class n8,n35 ok
  class n10,n12,n18,n20,n31 dec
  class n14 api
  class n16 app
  class n17,n23 dom
  class n24 infra
  class n26,n28,n30,n34 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/cash-control/warehouse/initial-balance: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** WarehousePanelComponent.saveInitialBalance (comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts), [`comercial-jhoel-app/src/app/core/services/cash-custody.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO WarehouseInitialBalanceRequestDto | !(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', ) | !input.reason || input.reason.trim().length < 5 | SQL register_warehouse_initial_balance: p_reason IS NULL OR length(trim(p_reason)) < 5
6. **¿Dónde se almacenan los datos?** cash_balance(), cash_current_bank_day(), register_warehouse_initial_balance(), warehouse_cash_movements, warehouse_cash_withdrawals
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
