# POST /api/account-receivable-payments/:id/void

Módulo: **Cuentas por Cobrar (accounts-receivable)** · Fuente editable: [`post-account-receivable-payments-id-void.mmd`](post-account-receivable-payments-id-void.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/account-receivable-payments/:id/void"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["AccountReceivablePaymentService.voidSettlement<br/><small>app/core/services/account-receivable-payment.service.ts</small>"]
  n6["PaymentHistoryModalComponent.confirmVoid<br/><small>app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/account-receivable-payments/:id/void<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿VoidSettlementRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["AccountReceivablePaymentsController.void<br/><small>api/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["VoidAccountReceivableSettlementUseCase.execute<br/><small>api/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts</small>"]
  n19["assertSettlementRole()<br/><small>llamada en L289</small><br/><small>api/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts</small>"]
  n20{"¿!(SETTLEMENT_ROLES as readonly string[]).includes(role)?<br/><small>L24</small>"}
  n21(["settlementError('AR_SETTLEMENT_FORBIDDEN')"])
  n22{"¿reason.length #lt; 5?<br/><small>L291</small>"}
  n23(["settlementError('AR_SETTLEMENT_REASON_REQUIRED')"])
  n24{"¿!operation?<br/><small>L299</small>"}
  n25(["settlementError('AR_SETTLEMENT_NOT_FOUND')"])
  end
  subgraph s26["Dominio → Infraestructura"]
  n27["Puerto AccountReceivableSettlementRepository.void / findById / getCashBalance<br/>@Inject(ACCOUNT_RECEIVABLE_SETTLEMENT_REPOSITORY)"]
  n28["TypeOrmAccountReceivableSettlementRepository<br/><small>api/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts</small>"]
  subgraph s29["PostgreSQL — función void_account_receivable_payment"]
  n30[["SELECT void_account_receivable_payment(…)<br/><small>void — una transacción</small>"]]
  n31{"¿p_reason IS NULL OR length(trim(p_reason)) #lt; 5?"}
  n32(["RAISE AR_SETTLEMENT_REASON_REQUIRED<br/>(rollback)"])
  n33{"¿NOT FOUND?"}
  n34(["RAISE AR_SETTLEMENT_NOT_FOUND<br/>(rollback)"])
  n35["Otros RAISE de void_account_receivable_payment (condición no extraída):<br/>AR_SETTLEMENT_ALREADY_VOIDED"]
  n36[["reverse_bank_account_movements()"]]
  n37[("Escribe:<br/>account_receivable_payment_operations<br/>accounts_receivable")]
  end
  n38[("findById: SQL / TypeORM sobre<br/>account_receivable_payment_details<br/>accounts_receivable")]
  subgraph s39["PostgreSQL — función cash_balance"]
  n40[["SELECT cash_balance(…)<br/><small>getCashBalance — una transacción</small>"]]
  end
  end
  n41(["Fin: la interfaz se actualiza<br/>this.isVoidSaving.set<br/>this.voidError.set<br/>this.showVoidForm.set<br/>this.operation.set<br/>this.notifications.success<br/>this.changed.emit"])
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
  n24 -->|no| n27
  n27 -->|implementa| n28
  n28 -->|void| n30
  n30 --> n31
  n31 -->|sí| n32
  n32 --> n2
  n31 -->|no| n33
  n33 -->|sí| n34
  n34 --> n2
  n30 -.->|también puede lanzar| n35
  n35 --> n2
  n33 -->|no · llama| n36
  n33 -->|no| n37
  n37 -->|COMMIT| n8
  n28 --> n38
  n38 --> n8
  n28 -->|getCashBalance| n40
  n40 --> n8
  n8 --> n41
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
  class n2,n3,n11,n13,n15,n21,n23,n25,n32,n34,n35 err
  class n5,n6,n7 fe
  class n8,n41 ok
  class n10,n12,n14,n20,n22,n24,n31,n33 dec
  class n16 api
  class n18 app
  class n19,n27 dom
  class n28 infra
  class n30,n36,n37,n38,n40 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/account-receivable-payments/:id/void: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** PaymentHistoryModalComponent.confirmVoid (comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts`](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts), [`comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/payment-history-modal/payment-history-modal.component.ts), [`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts), [`comercial-jhoel-api/src/modules/accounts-receivable/domain/repositories/account-receivable-settlement.repository.ts`](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/repositories/account-receivable-settlement.repository.ts), [`comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts`](../../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO VoidSettlementRequestDto | !(SETTLEMENT_ROLES as readonly string[]).includes(role) | reason.length < 5 | !operation | SQL void_account_receivable_payment: p_reason IS NULL OR length(trim(p_reason)) < 5 | SQL void_account_receivable_payment: NOT FOUND
6. **¿Dónde se almacenan los datos?** void_account_receivable_payment(), cash_balance(), account_receivable_payment_operations, accounts_receivable, account_receivable_payment_details
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
