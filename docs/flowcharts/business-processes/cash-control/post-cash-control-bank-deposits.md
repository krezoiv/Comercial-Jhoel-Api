# Control de Efectivo: depósito de caja a cuenta bancaria

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`post-cash-control-bank-deposits.mmd`](post-cash-control-bank-deposits.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Control de Efectivo: depósito de caja a cuenta bancaria"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CashControlService.registerBankDeposit<br/><small>app/core/services/cash-control.service.ts</small>"]
  n6["CashBankDepositModalComponent.save<br/><small>app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/cash-control/bank-deposits<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿RegisterCashBankDepositRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["CashControlController.registerBankDeposit<br/><small>api/cash-control/presentation/controllers/cash-control.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["RegisterCashBankDepositUseCase.execute<br/><small>api/cash-control/application/use-cases/register-cash-bank-deposit.use-case.ts</small>"]
  n19{"¿!(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(input.role)?<br/><small>L59</small>"}
  n20(["cashControlError('CASH_FORBIDDEN')"])
  n21{"¿!Number.isFinite(amount) #124;#124; amount #lt;= 0?<br/><small>L63</small>"}
  n22(["cashControlError('CASH_INVALID_AMOUNT')"])
  n23{"¿details.length === 0?<br/><small>L67</small>"}
  n24(["cashControlError('CASH_BREAKDOWN_REQUIRED')"])
  n25{"¿!VALID_DENOMINATIONS.includes(denomination) #124;#124; !Number.isInteger(row.quantity) #124;#124; seen.has(denomination)?<br/><small>L73</small>"}
  n26(["cashControlError('CASH_INVALID_DENOMINATION')"])
  n27{"¿total !== amount?<br/><small>L85</small>"}
  n28(["cashControlError('CASH_BREAKDOWN_MISMATCH')"])
  n29["assertBankOperationDayOpen()<br/><small>llamada en L89</small><br/><small>api/banks/application/use-cases/assert-bank-operation-day-open.ts</small>"]
  n30{"¿!dayOpening?<br/><small>L19</small>"}
  n31(["BankOperationDayNotOpenedError(businessDate)"])
  n32{"¿dayOpening.isClosed?<br/><small>L22</small>"}
  n33(["BankOperationDayClosedError(businessDate)"])
  n34{"¿!movement?<br/><small>L106</small>"}
  n35(["cashControlError('CASH_MOVEMENT_NOT_FOUND')"])
  end
  subgraph s36["Dominio → Infraestructura"]
  n37["Puerto CashControlRepository.registerBankDeposit / findMovementById / getBalance<br/>@Inject(CASH_CONTROL_REPOSITORY)"]
  n38["TypeOrmCashControlRepository<br/><small>api/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts</small>"]
  n39[("getBalance: SQL / TypeORM sobre<br/>cash_movements")]
  n40[("findMovementById: SQL / TypeORM sobre<br/>cash_movement_details")]
  subgraph s41["PostgreSQL — función register_cash_bank_deposit"]
  n42[["SELECT register_cash_bank_deposit(…)<br/><small>registerBankDeposit — una transacción</small>"]]
  n43{"¿p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0?"}
  n44(["RAISE CASH_IDEMPOTENCY_KEY_REQUIRED<br/>(rollback)"])
  n45{"¿NOT FOUND OR NOT v_bank.is_active?"}
  n46(["RAISE CASH_DEPOSIT_INVALID_BANK<br/>(rollback)"])
  n47{"¿v_bank.special_account = 'GUAYACAN'?"}
  n48(["RAISE CASH_DEPOSIT_GUAYACAN_NOT_ALLOWED<br/>(rollback)"])
  n49{"¿p_details IS NULL OR jsonb_typeof(p_details) #lt;#gt; 'array' OR jsonb_array_length(p_details) = 0?"}
  n50(["RAISE CASH_BREAKDOWN_REQUIRED<br/>(rollback)"])
  n51{"¿v_row.denomination IS NULL OR NOT cash_valid_denomination(v_row.denomination) OR v_row.quantity IS NULL OR v_row.quantity #lt;= 0 OR v_row.quantity #lt;#gt; trunc(v_row.?"}
  n52(["RAISE CASH_INVALID_DENOMINATION<br/>(rollback)"])
  n53{"¿v_total #lt;#gt; p_amount?"}
  n54(["RAISE CASH_BREAKDOWN_MISMATCH<br/>(rollback)"])
  n55{"¿cash_balance() #lt; p_amount?"}
  n56(["RAISE CASH_INSUFFICIENT_BALANCE<br/>(rollback)"])
  n57["Otros RAISE de register_cash_bank_deposit (condición no extraída):<br/>CASH_INVALID_AMOUNT"]
  n58[["apply_bank_account_movement()"]]
  n59[["apply_cash_movement()"]]
  n60[("Escribe:<br/>cash_movement_details")]
  end
  end
  n61(["Fin: la interfaz se actualiza<br/>this.isSaving.set<br/>this.errorMessage.set<br/>this.notifications.success<br/>this.saved.emit"])
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
  n21 -->|no| n23
  n23 -->|sí| n24
  n24 --> n2
  n23 -->|no| n25
  n25 -->|sí| n26
  n26 --> n2
  n25 -->|no| n27
  n27 -->|sí| n28
  n28 --> n2
  n27 -->|no| n29
  n29 --> n30
  n30 -->|sí| n31
  n31 --> n2
  n30 -->|no| n32
  n32 -->|sí| n33
  n33 --> n2
  n32 -->|no| n34
  n34 -->|sí| n35
  n35 --> n2
  n34 -->|no| n37
  n37 -->|implementa| n38
  n38 --> n39
  n39 --> n8
  n38 --> n40
  n40 --> n8
  n38 -->|registerBankDeposit| n42
  n42 --> n43
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
  n49 -->|no| n51
  n51 -->|sí| n52
  n52 --> n2
  n51 -->|no| n53
  n53 -->|sí| n54
  n54 --> n2
  n53 -->|no| n55
  n55 -->|sí| n56
  n56 --> n2
  n42 -.->|también puede lanzar| n57
  n57 --> n2
  n55 -->|no · llama| n58
  n55 -->|no · llama| n59
  n55 -->|no| n60
  n60 -->|COMMIT| n8
  n8 --> n61
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
  class n2,n3,n11,n13,n15,n20,n22,n24,n26,n28,n31,n33,n35,n44,n46,n48,n50,n52,n54,n56,n57 err
  class n5,n6,n7 fe
  class n8,n61 ok
  class n10,n12,n14,n19,n21,n23,n25,n27,n30,n32,n34,n43,n45,n47,n49,n51,n53,n55 dec
  class n16 api
  class n18 app
  class n29,n37 dom
  class n38 infra
  class n39,n40,n42,n58,n59,n60 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/cash-control/bank-deposits: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CashBankDepositModalComponent.save (comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts), [`comercial-jhoel-app/src/app/core/services/cash-control.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-bank-deposit-modal/cash-bank-deposit-modal.component.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/register-cash-bank-deposit.use-case.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/register-cash-bank-deposit.use-case.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/assert-bank-operation-day-open.ts`](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/assert-bank-operation-day-open.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO' | DTO RegisterCashBankDepositRequestDto | !(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(input.role) | !Number.isFinite(amount) || amount <= 0 | details.length === 0 | !VALID_DENOMINATIONS.includes(denomination) || !Number.isInteger(row.quantity) || seen.has(denomination) | total !== amount | !dayOpening | dayOpening.isClosed | !movement | SQL register_cash_bank_deposit: p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 | SQL register_cash_bank_deposit: NOT FOUND OR NOT v_bank.is_active | SQL register_cash_bank_deposit: v_bank.special_account = 'GUAYACAN'
6. **¿Dónde se almacenan los datos?** register_cash_bank_deposit(), cash_movements, cash_movement_details
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
