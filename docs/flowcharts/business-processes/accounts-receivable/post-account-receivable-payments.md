# Pago / cancelación de Cuentas por Cobrar

Módulo: **Cuentas por Cobrar (accounts-receivable)** · Fuente editable: [`post-account-receivable-payments.mmd`](post-account-receivable-payments.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Pago / cancelación de Cuentas por Cobrar"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["AccountReceivablePaymentService.settle<br/><small>app/core/services/account-receivable-payment.service.ts</small>"]
  n6["SettlementModalComponent.confirm<br/><small>app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/account-receivable-payments<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿SettleAccountsReceivableRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["AccountReceivablePaymentsController.settle<br/><small>api/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["SettleAccountsReceivableUseCase.execute<br/><small>api/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts</small>"]
  n19["assertSettlementRole()<br/><small>llamada en L231</small><br/><small>api/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts</small>"]
  n20{"¿!(SETTLEMENT_ROLES as readonly string[]).includes(role)?<br/><small>L24</small>"}
  n21(["settlementError('AR_SETTLEMENT_FORBIDDEN')"])
  n22{"¿input.items.length === 0?<br/><small>L232</small>"}
  n23(["settlementError('AR_SETTLEMENT_ITEMS_REQUIRED')"])
  n24{"¿isBank #amp;#amp; !input.bankId?<br/><small>L236</small>"}
  n25(["settlementError('AR_SETTLEMENT_BANK_REQUIRED')"])
  n26{"¿!operation?<br/><small>L263</small>"}
  n27(["settlementError('AR_SETTLEMENT_NOT_FOUND')"])
  end
  subgraph s28["Dominio → Infraestructura"]
  n29["Puerto AccountReceivableSettlementRepository.settle / findById / getCashBalance<br/>@Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY)"]
  n30["TypeOrmAccountReceivableSettlementRepository<br/><small>api/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts</small>"]
  subgraph s31["PostgreSQL — función settle_accounts_receivable"]
  n32[["SELECT settle_accounts_receivable(…)<br/><small>settle — una transacción</small>"]]
  n33{"¿p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0?"}
  n34(["RAISE AR_SETTLEMENT_IDEMPOTENCY_KEY_REQUIRED<br/>(rollback)"])
  n35{"¿(FOUND) y (v_existing.client_id #lt;#gt; p_client_id)?"}
  n36(["RAISE AR_SETTLEMENT_IDEMPOTENCY_CONFLICT<br/>(rollback)"])
  n37{"¿p_payment_method IS NULL OR p_payment_method NOT IN ('EFECTIVO', 'DEPOSITO_BANCARIO')?"}
  n38(["RAISE AR_SETTLEMENT_INVALID_METHOD<br/>(rollback)"])
  n39{"¿NOT FOUND?"}
  n40(["RAISE AR_SETTLEMENT_CLIENT_NOT_FOUND<br/>(rollback)"])
  n41{"¿p_items IS NULL OR jsonb_typeof(p_items) #lt;#gt; 'array' OR jsonb_array_length(p_items) = 0?"}
  n42(["RAISE AR_SETTLEMENT_ITEMS_REQUIRED<br/>(rollback)"])
  n43{"¿v_count #gt; 200?"}
  n44(["RAISE AR_SETTLEMENT_TOO_MANY_ITEMS<br/>(rollback)"])
  n45{"¿(SELECT count(DISTINCT e-#gt;#gt;'id') FROM jsonb_array_elements(p_items) e) #lt;#gt; v_count?"}
  n46(["RAISE AR_SETTLEMENT_DUPLICATE_ITEM<br/>(rollback)"])
  n47{"¿(p_payment_method = 'DEPOSITO_BANCARIO') y (p_bank_id IS NULL)?"}
  n48(["RAISE AR_SETTLEMENT_BANK_REQUIRED<br/>(rollback)"])
  n49{"¿NOT FOUND OR NOT v_bank.is_active?"}
  n50(["RAISE AR_SETTLEMENT_INVALID_BANK<br/>(rollback)"])
  n51{"¿v_bank.special_account = 'GUAYACAN'?"}
  n52(["RAISE AR_SETTLEMENT_GUAYACAN_NOT_ALLOWED<br/>(rollback)"])
  n53["… y 8 validaciones más (ver settle_accounts_receivable)"]
  n54["Otros RAISE de settle_accounts_receivable (condición no extraída):<br/>AR_SETTLEMENT_CASH_NOT_RECORDED, AR_SETTLEMENT_PARTIAL_NOT_ALLOWED"]
  n55[["apply_bank_account_movement()"]]
  n56[["register_account_receivable_movement()"]]
  n57[("Escribe:<br/>account_receivable_payment_details<br/>account_receivable_payment_operations")]
  end
  n58[("findById: SQL / TypeORM sobre<br/>account_receivable_payment_details<br/>accounts_receivable")]
  subgraph s59["PostgreSQL — función cash_balance"]
  n60[["SELECT cash_balance(…)<br/><small>getCashBalance — una transacción</small>"]]
  end
  end
  n61(["Fin: la interfaz se actualiza<br/>this.isSaving.set<br/>this.errorMessage.set<br/>this.notifications.success<br/>this.saved.emit<br/>this.step.set"])
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
  n26 -->|sí| n27
  n27 --> n2
  n26 -->|no| n29
  n29 -->|implementa| n30
  n30 -->|settle| n32
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
  n49 -->|no| n51
  n51 -->|sí| n52
  n52 --> n2
  n51 -->|no| n53
  n32 -.->|también puede lanzar| n54
  n54 --> n2
  n53 -->|no · llama| n55
  n53 -->|no · llama| n56
  n53 -->|no| n57
  n57 -->|COMMIT| n8
  n30 --> n58
  n58 --> n8
  n30 -->|getCashBalance| n60
  n60 --> n8
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
  class n2,n3,n11,n13,n15,n21,n23,n25,n27,n34,n36,n38,n40,n42,n44,n46,n48,n50,n52,n54 err
  class n5,n6,n7 fe
  class n8,n61 ok
  class n10,n12,n14,n20,n22,n24,n26,n33,n35,n37,n39,n41,n43,n45,n47,n49,n51,n53 dec
  class n16 api
  class n18 app
  class n19,n29 dom
  class n30 infra
  class n32,n55,n56,n57,n58,n60 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/account-receivable-payments: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** SettlementModalComponent.confirm (comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts`](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts), [`comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts), [`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts), [`comercial-jhoel-api/src/modules/accounts-receivable/domain/repositories/account-receivable-settlement.repository.ts`](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/repositories/account-receivable-settlement.repository.ts), [`comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts`](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO SettleAccountsReceivableRequestDto | !(SETTLEMENT_ROLES as readonly string[]).includes(role) | input.items.length === 0 | isBank && !input.bankId | !operation | SQL settle_accounts_receivable: p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 | SQL settle_accounts_receivable: (FOUND) y (v_existing.client_id <> p_client_id) | SQL settle_accounts_receivable: p_payment_method IS NULL OR p_payment_method NOT IN ('EFECTIVO', 'DEPOSITO_BANCARIO') | SQL settle_accounts_receivable: NOT FOUND | SQL settle_accounts_receivable: p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 | SQL settle_accounts_receivable: v_count > 200 | SQL settle_accounts_receivable: (SELECT count(DISTINCT e->>'id') FROM jsonb_array_elements(p_items) e) <> v_count
6. **¿Dónde se almacenan los datos?** settle_accounts_receivable(), cash_balance(), account_receivable_payment_details, account_receivable_payment_operations, accounts_receivable
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
