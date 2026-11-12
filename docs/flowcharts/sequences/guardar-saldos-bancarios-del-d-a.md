# Secuencia — Guardar saldos bancarios del día

Módulo: **Bancos y Agentes Bancarios (día, saldos, cuadre, transferencias) (banks)** · Fuente editable: [`guardar-saldos-bancarios-del-d-a.mmd`](guardar-saldos-bancarios-del-d-a.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as BankAgentsPageComponent
  participant S as BankBalanceService
  participant G as API (guards y ValidationPipe)
  participant CT as BanksController
  participant UC0 as SaveBankBalancesUseCase
  participant R0 as TypeOrmBankBalanceRepository
  participant R1 as TypeOrmDayOpeningRepository
  participant DB as PostgreSQL
  U->>C: confirmSaveChanges()
  C->>S: saveBalances(…)
  S->>G: POST /api/banks/balances + Bearer JWT
  alt falla JWT válido y usuario activo / DTO SaveBankBalancesRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: saveBalances(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt !input.operationDate #124;#124; !DATE_PATTERN.test(input.operationDate)
    UC0-->>G: InvalidBankBalanceDateError()
  end
  opt !input.entries #124;#124; input.entries.length === 0
    UC0-->>G: NoBankBalancesToSaveError()
  end
  opt input.operationDate === todayIsoDate() #amp;#amp; !dayOpening
    UC0-->>G: DayNotOpenedError(input.operationDate, 'balances')
  end
  opt dayOpening?.isClosed
    UC0-->>G: DayAlreadyClosedError(input.operationDate)
  end
  UC0->>R0: saveBalances()
  R0->>DB: SELECT save_bank_balance(…)
  Note over DB: valida 4 reglas (INVALID_OPERATION_DATE, BANK_NOT_FOUND, BANK_INACTIVE, …)
  Note over DB: escribe bank_balances
  alt RAISE EXCEPTION
    DB-->>R0: error con código
    R0-->>G: DomainError (traducido)
  else COMMIT
    DB-->>R0: resultado
  end
  R0-->>UC0: datos
  UC0->>R1: findByDate()
  R1-->>UC0: datos
  UC0-->>CT: salida
  CT-->>G: objeto
  G-->>C: success true con data
  end
  C-->>U: actualiza la interfaz (this.isSaving.set, this.isSaveConfirmModalOpen.set, this.notificationService.success)
```

## Explicación

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/banks/balances, con las validaciones y la transacción
2. **¿Dónde comienza?** BankBalanceService.saveBalances
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts`](../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts), [`comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts`](../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts), [`comercial-jhoel-app/src/app/core/services/bank-balance.service.ts`](../../../comercial-jhoel-app/src/app/core/services/bank-balance.service.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/save-bank-balances.use-case.ts`](../../../comercial-jhoel-api/src/modules/banks/application/use-cases/save-bank-balances.use-case.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-balance.repository.ts`](../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-balance.repository.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts`](../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/banks/post-banks-balances.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
