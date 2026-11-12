# POST /api/cash-control/warehouse/transfers/:id/void

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`post-cash-control-warehouse-transfers-id-void.mmd`](post-cash-control-warehouse-transfers-id-void.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/cash-control/warehouse/transfers/:id/void"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CashCustodyService.voidTransfer<br/><small>app/core/services/cash-custody.service.ts</small>"]
  n6["WarehousePanelComponent.confirmVoid<br/><small>app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/cash-control/warehouse/transfers/:id/void<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿ReasonRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["CashCustodyController.voidWarehouseTransfer<br/><small>api/cash-control/presentation/controllers/cash-custody.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["VoidWarehouseTransferUseCase.execute<br/><small>api/cash-control/application/use-cases/cash-custody.use-cases.ts</small>"]
  n17["assertCashCustodyPermission()<br/><small>llamada en L124</small><br/><small>api/cash-control/domain/policies/cash-control.policy.ts</small>"]
  n18{"¿!(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', )?<br/><small>L32</small>"}
  n19(["cashControlError('CASH_CUSTODY_FORBIDDEN')"])
  n20{"¿!input.reason #124;#124; input.reason.trim().length #lt; 5?<br/><small>L125</small>"}
  n21(["cashControlError('CASH_REASON_REQUIRED')"])
  n22{"¿!transfer?<br/><small>L137</small>"}
  n23(["cashControlError('CASH_WAREHOUSE_TRANSFER_NOT_FOUND')"])
  end
  subgraph s24["Dominio → Infraestructura"]
  n25["Puerto CashCustodyRepository.voidTransfer / findTransferById / getCustody<br/>@Inject(CASH_CUSTODY_REPOSITORY)"]
  n26["TypeOrmCashCustodyRepository<br/><small>api/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts</small>"]
  subgraph s27["PostgreSQL — función cash_balance"]
  n28[["SELECT cash_balance(…)<br/><small>getCustody — una transacción</small>"]]
  end
  subgraph s29["PostgreSQL — función cash_current_bank_day"]
  n30[["SELECT cash_current_bank_day(…)<br/><small>getCustody — una transacción</small>"]]
  end
  subgraph s31["PostgreSQL — función void_cash_warehouse_transfer"]
  n32[["SELECT void_cash_warehouse_transfer(…)<br/><small>voidTransfer — una transacción</small>"]]
  n33{"¿p_reason IS NULL OR length(trim(p_reason)) #lt; 5?"}
  n34(["RAISE CASH_REASON_REQUIRED<br/>(rollback)"])
  n35{"¿NOT FOUND?"}
  n36(["RAISE CASH_WAREHOUSE_TRANSFER_NOT_FOUND<br/>(rollback)"])
  n37{"¿v_transfer.status = 'ANULADA'?"}
  n38(["RAISE CASH_WAREHOUSE_TRANSFER_ALREADY_VOIDED<br/>(rollback)"])
  n39[["apply_warehouse_cash_movement()"]]
  n40[["cash_custody_assert_role()"]]
  n41[["reverse_cash_movement()"]]
  n42[("Escribe:<br/>cash_warehouse_transfers<br/>warehouse_cash_movements")]
  end
  n43[("findTransferById: TypeORM Repository")]
  end
  n44(["Fin: la interfaz se actualiza<br/>this.voiding.set<br/>this.voidTarget.set<br/>this.notifications.success<br/>this.changed.emit<br/>this.notifications.error"])
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
  n20 -->|no| n22
  n22 -->|sí| n23
  n23 --> n2
  n22 -->|no| n25
  n25 -->|implementa| n26
  n26 -->|getCustody| n28
  n28 --> n8
  n26 -->|getCustody| n30
  n30 --> n8
  n26 -->|voidTransfer| n32
  n32 --> n33
  n33 -->|sí| n34
  n34 --> n2
  n33 -->|no| n35
  n35 -->|sí| n36
  n36 --> n2
  n35 -->|no| n37
  n37 -->|sí| n38
  n38 --> n2
  n37 -->|no · llama| n39
  n37 -->|no · llama| n40
  n37 -->|no · llama| n41
  n37 -->|no| n42
  n42 -->|COMMIT| n8
  n26 --> n43
  n43 --> n8
  n8 --> n44
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
  class n2,n3,n11,n13,n19,n21,n23,n34,n36,n38 err
  class n5,n6,n7 fe
  class n8,n44 ok
  class n10,n12,n18,n20,n22,n33,n35,n37 dec
  class n14 api
  class n16 app
  class n17,n25 dom
  class n26 infra
  class n28,n30,n32,n39,n40,n41,n42,n43 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/cash-control/warehouse/transfers/:id/void: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** WarehousePanelComponent.confirmVoid (comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts), [`comercial-jhoel-app/src/app/core/services/cash-custody.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-panel/warehouse-panel.component.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO ReasonRequestDto | !(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', ) | !input.reason || input.reason.trim().length < 5 | !transfer | SQL void_cash_warehouse_transfer: p_reason IS NULL OR length(trim(p_reason)) < 5 | SQL void_cash_warehouse_transfer: NOT FOUND | SQL void_cash_warehouse_transfer: v_transfer.status = 'ANULADA'
6. **¿Dónde se almacenan los datos?** cash_balance(), cash_current_bank_day(), void_cash_warehouse_transfer(), warehouse_cash_movements, warehouse_cash_withdrawals, cash_warehouse_transfers
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
