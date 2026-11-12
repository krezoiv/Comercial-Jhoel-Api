# Transaccionar: depósitos, retiros, desembolsos y pagos Génesis, reintegros

Módulo: **Transaccionar (operaciones bancarias) (bank-deposits)** · Fuente editable: [`post-bank-deposits.mmd`](post-bank-deposits.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Transaccionar: depósitos, retiros, desembolsos y pagos Génesis, reintegros"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["BankDepositService.registerOperation<br/><small>app/core/services/bank-deposit.service.ts</small>"]
  n6["TransaccionarPageComponent.confirmSave<br/><small>app/features/dashboard/transaccionar/transaccionar-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/bank-deposits<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿CreateBankDepositRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["BankDepositsController.create<br/><small>api/bank-deposits/presentation/controllers/bank-deposits.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["RegisterBankDepositOperationUseCase.execute<br/><small>api/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.ts</small>"]
  n17{"¿!dayOpening?<br/><small>L159</small>"}
  n18(["BankDepositDayNotOpenedError(operationDate)"])
  n19{"¿dayOpening.isClosed?<br/><small>L162</small>"}
  n20(["BankDepositDayAlreadyClosedError(operationDate)"])
  n21{"¿!description?<br/><small>L168</small>"}
  n22(["InvalidBankDepositDescriptionError('REQUIRED')"])
  n23{"¿description.length #gt; BANK_DEPOSIT_DESCRIPTION_MAX_LENGTH?<br/><small>L171</small>"}
  n24(["InvalidBankDepositDescriptionError('TOO_LONG')"])
  n25{"¿cashBreakdownEnabled #amp;#amp; input.cashDetails.length === 0?<br/><small>L176</small>"}
  n26(["CashBreakdownRequiredError()"])
  n27{"¿!cashBreakdownEnabled #amp;#amp; (input.cashDetails.length #gt; 0 #124;#124; (input.changeGiven ?? 0) !== 0)?<br/><small>L179</small>"}
  n28(["CashBreakdownNotExpectedError()"])
  n29{"¿!client #124;#124; !client.isActive?<br/><small>L196</small>"}
  n30(["InvalidBankDepositClientError()"])
  n31{"¿sendToAccountsReceivable #amp;#amp; sendToAssets?<br/><small>L203</small>"}
  n32(["BankDepositAssetsAndReceivableConflictError()"])
  n33{"¿!clientId?<br/><small>L207</small>"}
  n34(["BankDepositAccountsReceivableRequiresClientError()"])
  n35{"¿!input.isAdmin?<br/><small>L210</small>"}
  n36(["BankDepositAccountsReceivableForbiddenError()"])
  n37{"¿!transactionType?.balanceEffect #124;#124; !ASSET_ELIGIBLE_BALANCE_EFFECTS.includes(transactionType.balanceEffect)?<br/><small>L218</small>"}
  n38(["BankDepositAssetsWrongTypeError()"])
  end
  n39["Puerto DayOpeningRepository<br/><small>findByDate</small>"]
  n40["Puerto ClientRepository<br/><small>findById</small>"]
  n41["Puerto TransactionTypeRepository<br/><small>findById</small>"]
  n42["Puerto BankMovementRepository<br/><small>findByReference</small>"]
  n43["Puerto CashControlRepository<br/><small>findMovementsByReference, getBalance</small>"]
  subgraph s44["Dominio → Infraestructura"]
  n45["Puerto BankDepositRepository.registerOperation<br/>@Inject(BANK_DEPOSIT_REPOSITORY)"]
  n46["TypeOrmBankDepositRepository<br/><small>api/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts</small>"]
  subgraph s47["PostgreSQL — función register_bank_deposit_operation"]
  n48[["SELECT register_bank_deposit_operation(…)<br/><small>registerOperation — una transacción</small>"]]
  n49{"¿p_total_amount IS NULL OR p_total_amount #lt;= 0?"}
  n50(["RAISE INVALID_DEPOSIT_AMOUNT<br/>(rollback)"])
  n51{"¿p_operation_date IS NULL?"}
  n52(["RAISE INVALID_DEPOSIT_AMOUNT<br/>(rollback)"])
  n53{"¿v_change_given #lt; 0?"}
  n54(["RAISE INVALID_CHANGE_GIVEN<br/>(rollback)"])
  n55{"¿NOT FOUND?"}
  n56(["RAISE TRANSACTION_TYPE_NOT_FOUND<br/>(rollback)"])
  n57{"¿NOT v_transaction_type.is_active?"}
  n58(["RAISE TRANSACTION_TYPE_INACTIVE<br/>(rollback)"])
  n59{"¿NOT FOUND?"}
  n60(["RAISE TRANSACTION_BANK_NOT_FOUND<br/>(rollback)"])
  n61{"¿NOT v_bank.is_active?"}
  n62(["RAISE TRANSACTION_BANK_INACTIVE<br/>(rollback)"])
  n63{"¿(v_transaction_type.balance_effect IS NOT NULL) y (p_bank_account_id IS NULL)?"}
  n64(["RAISE BANK_ACCOUNT_REQUIRED<br/>(rollback)"])
  n65{"¿NOT FOUND?"}
  n66(["RAISE BANK_ACCOUNT_NOT_AVAILABLE<br/>(rollback)"])
  n67{"¿v_genesis_account_id = v_bank_account_id?"}
  n68(["RAISE REINTEGRO_SOURCE_IS_GENESIS<br/>(rollback)"])
  n69["… y 9 validaciones más (ver register_bank_deposit_operation)"]
  n70["Otros RAISE de register_bank_deposit_operation (condición no extraída):<br/>BANK_DEPOSIT_CLIENT_INVALID, GENESIS_ACCOUNT_NOT_CONFIGURED, INVALID_CASH_QUANTITY"]
  n71[["apply_bank_account_movement()"]]
  n72[("Escribe:<br/>bank_deposit_cash_details<br/>bank_deposit_operations<br/>bank_deposit_transactions")]
  end
  end
  subgraph s73["Dominio → Infraestructura"]
  n74["Puerto TransactionManager.runInTransaction<br/>@Inject(TRANSACTION_MANAGER)"]
  n75["TypeOrmTransactionManager<br/><small>api/shared/infrastructure/services/typeorm-transaction-manager.service.ts</small>"]
  n76[("runInTransaction: TypeORM Repository")]
  end
  n77["Otro caso de uso: RegisterAssetChargeUseCase.execute"]
  n78["Otro caso de uso: RegisterAccountReceivableChargeUseCase.execute"]
  n79(["Fin: la interfaz se actualiza<br/>this.isSaving.set<br/>this.isConfirmOpen.set<br/>this.descriptionTouched.set<br/>this.view.set<br/>this.notificationService.success<br/>this.cashBalance.set"])
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
  n17 -->|sí| n18
  n18 --> n2
  n17 -->|no| n19
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
  n29 -->|sí| n30
  n30 --> n2
  n29 -->|no| n31
  n31 -->|sí| n32
  n32 --> n2
  n31 -->|no| n33
  n33 -->|sí| n34
  n34 --> n2
  n33 -->|no| n35
  n35 -->|sí| n36
  n36 --> n2
  n35 -->|no| n37
  n37 -->|sí| n38
  n38 --> n2
  n16 -.->|consulta| n39
  n16 -.->|consulta| n40
  n16 -.->|consulta| n41
  n16 -.->|consulta| n42
  n16 -.->|consulta| n43
  n37 -->|no| n45
  n45 -->|implementa| n46
  n46 -->|registerOperation| n48
  n48 --> n49
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
  n55 -->|no| n57
  n57 -->|sí| n58
  n58 --> n2
  n57 -->|no| n59
  n59 -->|sí| n60
  n60 --> n2
  n59 -->|no| n61
  n61 -->|sí| n62
  n62 --> n2
  n61 -->|no| n63
  n63 -->|sí| n64
  n64 --> n2
  n63 -->|no| n65
  n65 -->|sí| n66
  n66 --> n2
  n65 -->|no| n67
  n67 -->|sí| n68
  n68 --> n2
  n67 -->|no| n69
  n48 -.->|también puede lanzar| n70
  n70 --> n2
  n69 -->|no · llama| n71
  n69 -->|no| n72
  n72 -->|COMMIT| n8
  n37 -->|no| n74
  n74 -->|implementa| n75
  n75 --> n76
  n76 --> n8
  n37 -->|no| n77
  n37 -->|no| n78
  n8 --> n79
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
  class n2,n3,n11,n13,n18,n20,n22,n24,n26,n28,n30,n32,n34,n36,n38,n50,n52,n54,n56,n58,n60,n62,n64,n66,n68,n70 err
  class n5,n6,n7 fe
  class n8,n79 ok
  class n10,n12,n17,n19,n21,n23,n25,n27,n29,n31,n33,n35,n37,n49,n51,n53,n55,n57,n59,n61,n63,n65,n67,n69 dec
  class n14 api
  class n16,n77,n78 app
  class n39,n40,n41,n42,n43,n45,n74 dom
  class n46,n75 infra
  class n48,n71,n72,n76 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/bank-deposits: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** TransaccionarPageComponent.confirmSave (comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts`](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts), [`comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/transaccionar/transaccionar-page.component.ts), [`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.ts`](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.ts), [`comercial-jhoel-api/src/modules/banks/domain/repositories/day-opening.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/day-opening.repository.ts), [`comercial-jhoel-api/src/modules/clients/domain/repositories/client.repository.ts`](../../../../comercial-jhoel-api/src/modules/clients/domain/repositories/client.repository.ts), [`comercial-jhoel-api/src/modules/transaction-types/domain/repositories/transaction-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/transaction-types/domain/repositories/transaction-type.repository.ts), [`comercial-jhoel-api/src/modules/banks/domain/repositories/bank-movement.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/bank-movement.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-control.repository.ts), [`comercial-jhoel-api/src/modules/bank-deposits/domain/repositories/bank-deposit.repository.ts`](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/repositories/bank-deposit.repository.ts), [`comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts`](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts), [`comercial-jhoel-api/src/shared/application/ports/transaction-manager.port.ts`](../../../../comercial-jhoel-api/src/shared/application/ports/transaction-manager.port.ts), [`comercial-jhoel-api/src/shared/infrastructure/services/typeorm-transaction-manager.service.ts`](../../../../comercial-jhoel-api/src/shared/infrastructure/services/typeorm-transaction-manager.service.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO CreateBankDepositRequestDto | !dayOpening | dayOpening.isClosed | !description | description.length > BANK_DEPOSIT_DESCRIPTION_MAX_LENGTH | cashBreakdownEnabled && input.cashDetails.length === 0 | !cashBreakdownEnabled && (input.cashDetails.length > 0 || (input.changeGiven ?? 0) !== 0) | !client || !client.isActive | sendToAccountsReceivable && sendToAssets | !clientId | !input.isAdmin | !transactionType?.balanceEffect || !ASSET_ELIGIBLE_BALANCE_EFFECTS.includes(transactionType.balanceEffect) | SQL register_bank_deposit_operation: p_total_amount IS NULL OR p_total_amount <= 0
6. **¿Dónde se almacenan los datos?** register_bank_deposit_operation(), bank_deposit_cash_details, bank_deposit_operations, bank_deposit_transactions
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
