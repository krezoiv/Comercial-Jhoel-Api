# Retiro de Bodega (a caja o a cuenta)

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`post-cash-control-warehouse-withdrawals.mmd`](post-cash-control-warehouse-withdrawals.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Retiro de Bodega (a caja o a cuenta)"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CashCustodyService.registerWithdrawal<br/><small>app/core/services/cash-custody.service.ts</small>"]
  n6["WarehouseWithdrawalModalComponent.save<br/><small>app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/cash-control/warehouse/withdrawals<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿RegisterWarehouseWithdrawalRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["CashCustodyController.createWithdrawal<br/><small>api/cash-control/presentation/controllers/cash-custody.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["RegisterWarehouseWithdrawalUseCase.execute<br/><small>api/cash-control/application/use-cases/cash-custody.use-cases.ts</small>"]
  n17["assertCashCustodyPermission()<br/><small>llamada en L424</small><br/><small>api/cash-control/domain/policies/cash-control.policy.ts</small>"]
  n18{"¿!(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', )?<br/><small>L32</small>"}
  n19(["cashControlError('CASH_CUSTODY_FORBIDDEN')"])
  n20{"¿input.destination === 'BANCO' #amp;#amp; !input.bankId?<br/><small>L429</small>"}
  n21(["cashControlError('WAREHOUSE_WITHDRAWAL_BANK_REQUIRED')"])
  n22{"¿!withdrawal?<br/><small>L448</small>"}
  n23(["cashControlError('WAREHOUSE_WITHDRAWAL_NOT_FOUND')"])
  end
  subgraph s24["Dominio → Infraestructura"]
  n25["Puerto CashCustodyRepository.registerWithdrawal / findWithdrawalById / getCustody<br/>@Inject(CASH_CUSTODY_REPOSITORY)"]
  n26["TypeOrmCashCustodyRepository<br/><small>api/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts</small>"]
  subgraph s27["PostgreSQL — función cash_balance"]
  n28[["SELECT cash_balance(…)<br/><small>getCustody — una transacción</small>"]]
  end
  subgraph s29["PostgreSQL — función cash_current_bank_day"]
  n30[["SELECT cash_current_bank_day(…)<br/><small>getCustody — una transacción</small>"]]
  end
  subgraph s31["PostgreSQL — función register_warehouse_withdrawal"]
  n32[["SELECT register_warehouse_withdrawal(…)<br/><small>registerWithdrawal — una transacción</small>"]]
  n33{"¿p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0?"}
  n34(["RAISE CASH_IDEMPOTENCY_KEY_REQUIRED<br/>(rollback)"])
  n35{"¿p_amount IS NULL OR p_amount #lt;= 0 OR p_amount #lt;#gt; round(p_amount, 2)?"}
  n36(["RAISE CASH_INVALID_AMOUNT<br/>(rollback)"])
  n37{"¿p_delivered_by IS NULL OR length(btrim(p_delivered_by)) #lt; 3 OR p_received_by IS NULL OR length(btrim(p_received_by)) #lt; 3?"}
  n38(["RAISE CASH_WAREHOUSE_PEOPLE_REQUIRED<br/>(rollback)"])
  n39{"¿v_day.day_opening_id IS NULL OR NOT v_day.is_open?"}
  n40(["RAISE CASH_CUSTODY_DAY_NOT_OPEN<br/>(rollback)"])
  n41{"¿(p_destination = 'BANCO') y (p_bank_id IS NULL)?"}
  n42(["RAISE WAREHOUSE_WITHDRAWAL_BANK_REQUIRED<br/>(rollback)"])
  n43{"¿NOT FOUND OR NOT v_bank.is_active?"}
  n44(["RAISE CASH_DEPOSIT_INVALID_BANK<br/>(rollback)"])
  n45{"¿v_bank.special_account = 'GUAYACAN'?"}
  n46(["RAISE CASH_DEPOSIT_GUAYACAN_NOT_ALLOWED<br/>(rollback)"])
  n47{"¿p_bank_id IS NOT NULL?"}
  n48(["RAISE WAREHOUSE_WITHDRAWAL_INVALID_DESTINATION<br/>(rollback)"])
  n49{"¿v_total #lt;#gt; p_amount?"}
  n50(["RAISE CASH_BREAKDOWN_MISMATCH<br/>(rollback)"])
  n51["Otros RAISE de register_warehouse_withdrawal (condición no extraída):<br/>CASH_INVALID_DENOMINATION, WAREHOUSE_INSUFFICIENT_BALANCE"]
  n52[["apply_bank_account_movement()"]]
  n53[["apply_cash_movement()"]]
  n54[["apply_warehouse_cash_movement()"]]
  n55[["cash_custody_assert_role()"]]
  n56[("Escribe:<br/>warehouse_cash_movement_details<br/>warehouse_cash_withdrawals")]
  end
  n57[("findWithdrawalById: TypeORM Repository")]
  end
  n58(["Fin: la interfaz se actualiza<br/>this.isSaving.set<br/>this.errorMessage.set<br/>this.notifications.success<br/>this.saved.emit"])
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
  n26 -->|registerWithdrawal| n32
  n32 --> n33
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
  n41 -->|no| n43
  n43 -->|sí| n44
  n44 --> n2
  n43 -->|no| n45
  n45 -->|sí| n46
  n46 --> n2
  n45 -->|no| n47
  n47 -->|sí| n48
  n48 --> n2
  n47 -->|no| n49
  n49 -->|sí| n50
  n50 --> n2
  n32 -.->|también puede lanzar| n51
  n51 --> n2
  n49 -->|no · llama| n52
  n49 -->|no · llama| n53
  n49 -->|no · llama| n54
  n49 -->|no · llama| n55
  n49 -->|no| n56
  n56 -->|COMMIT| n8
  n26 --> n57
  n57 --> n8
  n8 --> n58
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
  class n2,n3,n11,n13,n19,n21,n23,n34,n36,n38,n40,n42,n44,n46,n48,n50,n51 err
  class n5,n6,n7 fe
  class n8,n58 ok
  class n10,n12,n18,n20,n22,n33,n35,n37,n39,n41,n43,n45,n47,n49 dec
  class n14 api
  class n16 app
  class n17,n25 dom
  class n26 infra
  class n28,n30,n32,n52,n53,n54,n55,n56,n57 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/cash-control/warehouse/withdrawals: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** WarehouseWithdrawalModalComponent.save (comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts), [`comercial-jhoel-app/src/app/core/services/cash-custody.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO RegisterWarehouseWithdrawalRequestDto | !(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', ) | input.destination === 'BANCO' && !input.bankId | !withdrawal | SQL register_warehouse_withdrawal: p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 | SQL register_warehouse_withdrawal: p_amount IS NULL OR p_amount <= 0 OR p_amount <> round(p_amount, 2) | SQL register_warehouse_withdrawal: p_delivered_by IS NULL OR length(btrim(p_delivered_by)) < 3 OR p_received_by IS NULL OR length(btrim(p_received_by)) < 3 | SQL register_warehouse_withdrawal: v_day.day_opening_id IS NULL OR NOT v_day.is_open | SQL register_warehouse_withdrawal: (p_destination = 'BANCO') y (p_bank_id IS NULL) | SQL register_warehouse_withdrawal: NOT FOUND OR NOT v_bank.is_active | SQL register_warehouse_withdrawal: v_bank.special_account = 'GUAYACAN' | SQL register_warehouse_withdrawal: p_bank_id IS NOT NULL | SQL register_warehouse_withdrawal: v_total <> p_amount
6. **¿Dónde se almacenan los datos?** cash_balance(), cash_current_bank_day(), register_warehouse_withdrawal(), warehouse_cash_movements, warehouse_cash_withdrawals, warehouse_cash_movement_details
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
