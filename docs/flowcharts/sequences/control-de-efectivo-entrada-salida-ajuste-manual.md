# Secuencia — Control de Efectivo: entrada / salida / ajuste manual

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`control-de-efectivo-entrada-salida-ajuste-manual.mmd`](control-de-efectivo-entrada-salida-ajuste-manual.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as CashMovementFormModalComponent
  participant S as CashControlService
  participant G as API (guards y ValidationPipe)
  participant CT as CashControlController
  participant UC0 as RegisterCashMovementUseCase
  participant R0 as TypeOrmCashControlRepository
  participant DB as PostgreSQL
  U->>C: save()
  C->>S: registerMovement(…)
  S->>G: POST /api/cash-control/movements + Bearer JWT
  alt falla JWT válido y usuario activo / rol 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR_DE_TURNO' / DTO RegisterCashMovementRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: registerMovement(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt (input.movementType === 'AJUSTE' #124;#124; input.movementType === 'SALDO_INICIAL') #amp;#amp; !isCashAdmin(input.role)
    UC0-->>G: cashControlError('CASH_FORBIDDEN')
  end
  opt !Number.isFinite(amount) #124;#124; amount === 0 #124;#124; (input.movementType !== 'AJUSTE' #amp;#amp; amount #lt; 0)
    UC0-->>G: cashControlError('CASH_INVALID_AMOUNT')
  end
  UC0->>R0: registerManualMovement / findMovementById / getBalance()
  R0->>DB: SQL / TypeORM sobre cash_movements
  DB-->>R0: filas
  R0->>DB: SQL / TypeORM sobre cash_movement_details
  DB-->>R0: filas
  R0->>DB: SELECT register_manual_cash_movement(…)
  Note over DB: valida 5 reglas (CASH_INVALID_MOVEMENT_TYPE, CASH_INVALID_AMOUNT, CASH_INVALID_AMOUNT, …)
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

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/cash-control/movements, con las validaciones y la transacción
2. **¿Dónde comienza?** CashControlService.registerMovement
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts`](../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-control.controller.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.ts`](../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-movement-form-modal/cash-movement-form-modal.component.ts), [`comercial-jhoel-app/src/app/core/services/cash-control.service.ts`](../../../comercial-jhoel-app/src/app/core/services/cash-control.service.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-commands.use-cases.ts`](../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-movement-commands.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts`](../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-control.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/cash-control/post-cash-control-movements.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
