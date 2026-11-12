# POST /api/account-receivable-payments/preview

Módulo: **Cuentas por Cobrar (accounts-receivable)** · Fuente editable: [`post-account-receivable-payments-preview.mmd`](post-account-receivable-payments-preview.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/account-receivable-payments/preview"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["AccountReceivablePaymentService.preview<br/><small>app/core/services/account-receivable-payment.service.ts</small>"]
  n6["HTTP POST /api/account-receivable-payments/preview<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n7["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s8["API NestJS — presentación"]
  n9{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n10(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n11{"¿PreviewSettlementRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n12(["400 Datos inválidos"])
  n13["AccountReceivablePaymentsController.preview<br/><small>api/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts</small>"]
  end
  subgraph s14["Aplicación — caso de uso"]
  n15["PreviewAccountReceivableSettlementUseCase.execute<br/><small>api/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts</small>"]
  n16{"¿ids.length === 0?<br/><small>L110</small>"}
  n17(["settlementError('AR_SETTLEMENT_ITEMS_REQUIRED')"])
  n18{"¿new Set(ids).size !== ids.length?<br/><small>L113</small>"}
  n19(["settlementError('AR_SETTLEMENT_DUPLICATE_ITEM')"])
  n20{"¿clientName === null?<br/><small>L117</small>"}
  n21(["settlementError('AR_SETTLEMENT_CLIENT_NOT_FOUND')"])
  n22{"¿!charge?<br/><small>L125</small>"}
  n23(["settlementError('AR_SETTLEMENT_ACCOUNT_NOT_PAYABLE')"])
  n24{"¿charge.clientId !== input.clientId?<br/><small>L128</small>"}
  n25(["settlementError('AR_SETTLEMENT_MIXED_CLIENTS')"])
  n26{"¿charge.pendingAmount #lt;= 0?<br/><small>L131</small>"}
  n27(["settlementError('AR_SETTLEMENT_ALREADY_SETTLED')"])
  n28{"¿ids.length #gt; 1 #amp;#amp; amount !== charge.pendingAmount?<br/><small>L137</small>"}
  n29(["settlementError('AR_SETTLEMENT_PARTIAL_NOT_ALLOWED')"])
  n30{"¿!(amount #gt; 0)?<br/><small>L140</small>"}
  n31(["settlementError('AR_SETTLEMENT_INVALID_AMOUNT')"])
  n32{"¿amount #gt; charge.pendingAmount?<br/><small>L143</small>"}
  n33(["settlementError('AR_SETTLEMENT_AMOUNT_EXCEEDS_PENDING')"])
  n34{"¿!input.bankId?<br/><small>L163</small>"}
  n35(["settlementError('AR_SETTLEMENT_BANK_REQUIRED')"])
  n36{"¿!info #124;#124; !info.isActive?<br/><small>L167</small>"}
  n37(["settlementError('AR_SETTLEMENT_INVALID_BANK')"])
  n38{"¿info.specialAccount === 'GUAYACAN'?<br/><small>L170</small>"}
  n39(["settlementError('AR_SETTLEMENT_GUAYACAN_NOT_ALLOWED')"])
  end
  n40["Puerto AccountReceivableSettlementRepository<br/><small>findClientName, findChargeBalancesByIds, getCashBalance, findBank</small>"]
  n41(["Fin: la interfaz se actualiza"])
  n2 --> n3
  n1 --> n5
  n5 --> n6
  n6 --> n9
  n9 -->|no| n10
  n10 --> n3
  n9 -->|sí| n11
  n11 -->|no| n12
  n12 --> n2
  n11 -->|sí| n13
  n13 --> n15
  n15 --> n16
  n16 -->|sí| n17
  n17 --> n2
  n16 -->|no| n18
  n18 -->|sí| n19
  n19 --> n2
  n18 -->|no| n20
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
  n26 -->|no| n28
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
  n38 -->|sí| n39
  n39 --> n2
  n15 -.->|consulta| n40
  n38 -->|no| n7
  n7 --> n41
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
  class n2,n3,n10,n12,n17,n19,n21,n23,n25,n27,n29,n31,n33,n35,n37,n39 err
  class n5,n6 fe
  class n7,n41 ok
  class n9,n11,n16,n18,n20,n22,n24,n26,n28,n30,n32,n34,n36,n38 dec
  class n13 api
  class n15 app
  class n40 dom
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/account-receivable-payments/preview: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** AccountReceivablePaymentService.preview
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts`](../../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts), [`comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts), [`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts), [`comercial-jhoel-api/src/modules/accounts-receivable/domain/repositories/account-receivable-settlement.repository.ts`](../../../../comercial-jhoel-api/src/modules/accounts-receivable/domain/repositories/account-receivable-settlement.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO PreviewSettlementRequestDto | ids.length === 0 | new Set(ids).size !== ids.length | clientName === null | !charge | charge.clientId !== input.clientId | charge.pendingAmount <= 0 | ids.length > 1 && amount !== charge.pendingAmount | !(amount > 0) | amount > charge.pendingAmount | !input.bankId | !info || !info.isActive | info.specialAccount === 'GUAYACAN'
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
