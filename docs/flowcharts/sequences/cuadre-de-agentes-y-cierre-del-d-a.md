# Secuencia — Cuadre de Agentes y cierre del día

Módulo: **Bancos y Agentes Bancarios (día, saldos, cuadre, transferencias) (banks)** · Fuente editable: [`cuadre-de-agentes-y-cierre-del-d-a.mmd`](cuadre-de-agentes-y-cierre-del-d-a.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as CuadreAgentesPageComponent
  participant S as CuadreAgentesService
  participant G as API (guards y ValidationPipe)
  participant CT as AgentReconciliationsController
  participant UC0 as CloseAgentDayUseCase
  participant R0 as TypeOrmAgentReconciliationRepository
  participant R1 as TypeOrmDayOpeningRepository
  participant DB as PostgreSQL
  U->>C: confirmSaveCuadre()
  C->>S: registerReconciliation(…)
  S->>G: POST /api/agent-reconciliations + Bearer JWT
  alt falla JWT válido y usuario activo / DTO CreateAgentReconciliationRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: create(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt !dayOpening
    UC0-->>G: DayNotOpenedError(input.date, 'reconciliation')
  end
  opt dayOpening.isClosed
    UC0-->>G: DayAlreadyClosedError(input.date)
  end
  opt !balancesValidation.canReconcile
    UC0-->>G: BankBalancesNotRegisteredError(input.date)
  end
  opt !isValidDenomination(row.denomination) #124;#124; !Number.isInteger(row.quantity) #124;#124; row.quantity #lt; 0 #124;#124; seen.has(cents)
    UC0-->>G: CuadreCashBreakdownError('CUADRE_CASH_BREAKDOWN_INVALID')
  end
  opt (breakdown.source !== 'MANUAL') !== !!breakdown.sourceCashCountId
    UC0-->>G: CuadreCashBreakdownError('CUADRE_CASH_BREAKDOWN_INVALID')
  end
  Note over UC0: … y 1 validaciones más
  UC0->>R0: closeDayWithReconciliation()
  R0->>DB: SELECT close_agent_day_with_cash_breakdown(…)
  Note over DB: valida 6 reglas (CUADRE_CASH_BREAKDOWN_INVALID, CUADRE_CASH_BREAKDOWN_INVALID, CUADRE_CASH_BREAKDOWN_INVALID, …)
  Note over DB: escribe agent_reconciliation_cash_breakdowns, agent_reconciliation_cash_details
  alt RAISE EXCEPTION
    DB-->>R0: error con código
    R0-->>G: DomainError (traducido)
  else COMMIT
    DB-->>R0: resultado
  end
  R0->>DB: SELECT close_agent_day(…)
  Note over DB: valida 3 reglas (DAY_NOT_OPENED, DAY_ALREADY_CLOSED, BANK_BALANCES_NOT_REGISTERED)
  Note over DB: escribe agent_reconciliations, day_audit_logs, day_openings
  alt RAISE EXCEPTION
    DB-->>R0: error con código
    R0-->>G: DomainError (traducido)
  else COMMIT
    DB-->>R0: resultado
  end
  R0-->>UC0: datos
  UC0->>R1: findByDate()
  R1-->>UC0: datos
  UC0->>UC0: GetCuadreAgentesSummaryUseCase.execute
  UC0->>UC0: ValidateBankBalancesForDateUseCase.execute
  UC0-->>CT: salida
  CT-->>G: objeto
  G-->>C: success true con data
  end
  C-->>U: actualiza la interfaz (this.isSaving.set, this.isConfirmModalOpen.set, this.notificationService.success)
```

## Explicación

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/agent-reconciliations, con las validaciones y la transacción
2. **¿Dónde comienza?** CuadreAgentesService.registerReconciliation
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/banks/presentation/controllers/agent-reconciliations.controller.ts`](../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/agent-reconciliations.controller.ts), [`comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts`](../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts), [`comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts`](../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.ts`](../../../comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts`](../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts`](../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/banks/post-agent-reconciliations.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
