# Secuencia — Control de Efectivo: apertura del día operativo de efectivo

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`control-de-efectivo-apertura-del-d-a-operativo-de-efectivo.mmd`](control-de-efectivo-apertura-del-d-a-operativo-de-efectivo.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as CashCutControlPanelComponent
  participant S as CashControlService
  participant G as API (guards y ValidationPipe)
  participant CT as CashControlController
  participant UC0 as OpenCashDayUseCase
  participant R0 as TypeOrmCashControlRepository
  participant DB as PostgreSQL
  U->>C: openDay()
  C->>S: openDay(…)
  S->>G: POST /api/cash-control/days/open + Bearer JWT
  alt falla JWT válido y usuario activo / rol 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO' / DTO OpenCashDayRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: openDay(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt !isCashAdmin(input.role)
    UC0-->>G: cashControlError('CASH_MANUAL_OPENING_FORBIDDEN')
  end
  opt !Number.isFinite(manual) #124;#124; manual #lt; 0
    UC0-->>G: cashControlError('CASH_INVALID_AMOUNT')
  end
  opt times.some((time) =#gt; time)
    UC0-->>G: cashControlError('CASH_CUT_INVALID_SCHEDULE')
  end
  opt !(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(role)
    UC0-->>G: cashControlError('CASH_FORBIDDEN')
  end
  opt !isValidCutTime(start) #124;#124; !isValidCutTime(end) #124;#124; minutes(end) #lt;= minutes(start)
    UC0-->>G: cashControlError('CASH_CUT_INVALID_SCHEDULE')
  end
  Note over UC0: … y 1 validaciones más
  UC0->>R0: openDay()
  R0->>DB: SELECT open_cash_operational_day(…)
  Note over DB: valida 4 reglas (CASH_CUT_ANOTHER_OPEN, CASH_CUT_SCHEDULE_OVERLAP, CASH_INVALID_AMOUNT, …)
  Note over DB: escribe cash_cut_periods, cash_operational_days
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
  C-->>U: actualiza la interfaz
```

## Explicación

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/cash-control/days/open, con las validaciones y la transacción
2. **¿Dónde comienza?** CashControlService.openDay
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts`](../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts`](../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cut-control-panel/cut-control-panel.component.ts), [`comercial-jhoel-app/src/app/core/services/cash-control.service.ts`](../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts`](../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-cut-commands.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts`](../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/cash-control/post-cash-control-days-open.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
