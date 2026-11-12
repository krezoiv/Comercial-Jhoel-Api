# Secuencia — Control de Efectivo: finalizar corte (arqueo del corte)

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`control-de-efectivo-finalizar-corte-arqueo-del-corte.mmd`](control-de-efectivo-finalizar-corte-arqueo-del-corte.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as CashCutFinishModalComponent
  participant S as CashControlService
  participant G as API (guards y ValidationPipe)
  participant CT as CashControlController
  participant UC0 as FinishCashCutUseCase
  participant R0 as TypeOrmCashControlRepository
  participant DB as PostgreSQL
  U->>C: save()
  C->>S: finishCut(…)
  S->>G: POST /api/cash-control/cuts/:id/finish + Bearer JWT
  alt falla JWT válido y usuario activo / rol 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO' / DTO FinishCashCutRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: finishCut(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt !period
    UC0-->>G: cashControlError('CASH_CUT_NOT_FOUND')
  end
  opt seen.has(denomination) #124;#124; !Number.isInteger(row.quantity) #124;#124; row.quantity #lt; 0
    UC0-->>G: cashControlError('CASH_INVALID_DENOMINATION')
  end
  opt !(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(role)
    UC0-->>G: cashControlError('CASH_FORBIDDEN')
  end
  UC0->>R0: findPeriodById / finishPeriod()
  R0->>DB: SELECT finish_cash_cut_period(…)
  Note over DB: valida 5 reglas (CASH_CUT_NOT_FOUND, CASH_CUT_NOT_OPEN, CASH_INVALID_DENOMINATION, …)
  Note over DB: escribe cash_cut_bank_reconciliations, cash_cut_count_details, cash_cut_counts, cash_cut_events, cash_cut_periods
  alt RAISE EXCEPTION
    DB-->>R0: error con código
    R0-->>G: DomainError (traducido)
  else COMMIT
    DB-->>R0: resultado
  end
  R0-->>UC0: datos
  UC0->>UC0: GetCashPositionUseCase.execute
  UC0-->>CT: salida
  CT-->>G: objeto
  G-->>C: success true con data
  end
  C-->>U: actualiza la interfaz (this.isSaving.set, this.errorMessage.set, this.notifications.success)
```

## Explicación

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/cash-control/cuts/:id/finish, con las validaciones y la transacción
2. **¿Dónde comienza?** CashControlService.finishCut
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts`](../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.ts`](../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-finish-modal/cut-finish-modal.component.ts), [`comercial-jhoel-app/src/app/core/services/cash-control.service.ts`](../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts`](../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts`](../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/cash-control/post-cash-control-cuts-id-finish.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
