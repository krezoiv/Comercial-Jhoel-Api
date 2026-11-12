# Secuencia — Pago / cancelación de Cuentas por Cobrar

Módulo: **Cuentas por Cobrar (accounts-receivable)** · Fuente editable: [`pago-cancelaci-n-de-cuentas-por-cobrar.mmd`](pago-cancelaci-n-de-cuentas-por-cobrar.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as SettlementModalComponent
  participant S as AccountReceivablePaymentService
  participant G as API (guards y ValidationPipe)
  participant CT as AccountReceivablePaymentsController
  participant UC0 as SettleAccountsReceivableUseCase
  participant R0 as TypeOrmAccountReceivableSettlementRepository
  participant DB as PostgreSQL
  U->>C: confirm()
  C->>S: settle(…)
  S->>G: POST /api/account-receivable-payments + Bearer JWT
  alt falla JWT válido y usuario activo / rol 'ADMIN', 'SUPER_ADMIN' / DTO SettleAccountsReceivableRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: settle(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt input.items.length === 0
    UC0-->>G: settlementError('AR_SETTLEMENT_ITEMS_REQUIRED')
  end
  opt isBank #amp;#amp; !input.bankId
    UC0-->>G: settlementError('AR_SETTLEMENT_BANK_REQUIRED')
  end
  opt !operation
    UC0-->>G: settlementError('AR_SETTLEMENT_NOT_FOUND')
  end
  opt !(SETTLEMENT_ROLES as readonly string[]).includes(role)
    UC0-->>G: settlementError('AR_SETTLEMENT_FORBIDDEN')
  end
  UC0->>R0: settle / findById / getCashBalance()
  R0->>DB: SELECT settle_accounts_receivable(…)
  Note over DB: valida 18 reglas (AR_SETTLEMENT_IDEMPOTENCY_KEY_REQUIRED, AR_SETTLEMENT_IDEMPOTENCY_CONFLICT, AR_SETTLEMENT_INVALID_METHOD, …)
  Note over DB: escribe account_receivable_payment_details, account_receivable_payment_operations
  alt RAISE EXCEPTION
    DB-->>R0: error con código
    R0-->>G: DomainError (traducido)
  else COMMIT
    DB-->>R0: resultado
  end
  R0->>DB: SQL / TypeORM sobre account_receivable_payment_details, accounts_receivable
  DB-->>R0: filas
  R0->>DB: SELECT cash_balance(…)
  alt RAISE EXCEPTION
    DB-->>R0: error con código
    R0-->>G: DomainError (traducido)
  else COMMIT
    DB-->>R0: resultado
  end
  R0-->>UC0: datos
  UC0-->>CT: salida
  CT-->>G: objeto
  G-->>C: success true con data
  end
  C-->>U: actualiza la interfaz (this.isSaving.set, this.errorMessage.set, this.notifications.success)
```

## Explicación

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/account-receivable-payments, con las validaciones y la transacción
2. **¿Dónde comienza?** AccountReceivablePaymentService.settle
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts`](../../../comercial-jhoel-api/src/modules/accounts-receivable/presentation/controllers/account-receivable-payments.controller.ts), [`comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts`](../../../comercial-jhoel-app/src/app/features/dashboard/accounts-receivable/components/settlement-modal/settlement-modal.component.ts), [`comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts`](../../../comercial-jhoel-app/src/app/core/services/account-receivable-payment.service.ts), [`comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts`](../../../comercial-jhoel-api/src/modules/accounts-receivable/application/use-cases/account-receivable-settlement.use-cases.ts), [`comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts`](../../../comercial-jhoel-api/src/modules/accounts-receivable/infrastructure/persistence/typeorm-account-receivable-settlement.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/accounts-receivable/post-account-receivable-payments.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
