# Secuencia — Retiro de Bodega (a caja o a cuenta)

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`retiro-de-bodega-a-caja-o-a-cuenta.mmd`](retiro-de-bodega-a-caja-o-a-cuenta.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as WarehouseWithdrawalModalComponent
  participant S as CashCustodyService
  participant G as API (guards y ValidationPipe)
  participant CT as CashCustodyController
  participant UC0 as RegisterWarehouseWithdrawalUseCase
  participant R0 as TypeOrmCashCustodyRepository
  participant DB as PostgreSQL
  U->>C: save()
  C->>S: registerWithdrawal(…)
  S->>G: POST /api/cash-control/warehouse/withdrawals + Bearer JWT
  alt falla JWT válido y usuario activo / DTO RegisterWarehouseWithdrawalRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: createWithdrawal(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt input.destination === 'BANCO' #amp;#amp; !input.bankId
    UC0-->>G: cashControlError('WAREHOUSE_WITHDRAWAL_BANK_REQUIRED')
  end
  opt !withdrawal
    UC0-->>G: cashControlError('WAREHOUSE_WITHDRAWAL_NOT_FOUND')
  end
  opt !(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', )
    UC0-->>G: cashControlError('CASH_CUSTODY_FORBIDDEN')
  end
  UC0->>R0: registerWithdrawal / findWithdrawalById / getCustody()
  R0->>DB: SELECT cash_balance(…)
  alt RAISE EXCEPTION
    DB-->>R0: error con código
    R0-->>G: DomainError (traducido)
  else COMMIT
    DB-->>R0: resultado
  end
  R0->>DB: SELECT cash_current_bank_day(…)
  alt RAISE EXCEPTION
    DB-->>R0: error con código
    R0-->>G: DomainError (traducido)
  else COMMIT
    DB-->>R0: resultado
  end
  R0->>DB: SELECT register_warehouse_withdrawal(…)
  Note over DB: valida 9 reglas (CASH_IDEMPOTENCY_KEY_REQUIRED, CASH_INVALID_AMOUNT, CASH_WAREHOUSE_PEOPLE_REQUIRED, …)
  Note over DB: escribe warehouse_cash_movement_details, warehouse_cash_withdrawals
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

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/cash-control/warehouse/withdrawals, con las validaciones y la transacción
2. **¿Dónde comienza?** CashCustodyService.registerWithdrawal
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts`](../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts`](../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component.ts), [`comercial-jhoel-app/src/app/core/services/cash-custody.service.ts`](../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts`](../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`](../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/cash-control/post-cash-control-warehouse-withdrawals.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
